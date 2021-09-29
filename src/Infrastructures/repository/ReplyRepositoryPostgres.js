const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
// const DetailedComment = require('../../Domains/replies/entities/DetailedComment');

const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // async verifyCommentOwnership(owner, comment) {
  //   const query = {
  //     text: 'SELECT id FROM replies WHERE id = $1',
  //     values: [comment],
  //   };

  //   const result = await this._pool.query(query);

  //   if (result.rowCount == 0) {
  //     throw new NotFoundError('comment tidak ditemukan');
  //   }

  //   if (result.rows[0].id == owner) {
  //     throw new AuthenticationError('anda tidak memiliki comment ini');
  //   }
  // }

  async addReply(createReply) {
    const { content, owner, comment } = createReply;
    const id = `reply-${this._idGenerator()}`;
    const is_deleted = false; // defauit

    const query = {
      text: `INSERT INTO replies(id, content, owner, comment, is_deleted) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, content, owner`,
      values: [id, content, owner, comment, is_deleted],
    };

    const result = await this._pool.query(query);

    return new CreatedReply({ ...result.rows[0] });
  }

  // async deleteComment(selectedComment) {
  //   const is_deleted = true;

  //   const query = {
  //     text: `UPDATE replies
  //           SET is_deleted = $1
  //           WHERE id = $2;`,
  //     values: [is_deleted, selectedComment],
  //   };

  //   await this._pool.query(query);
  // }

  // async getCommentByThread(thread) {

  //   const query = {
  //     text: `SELECT id, content, owner, date, is_deleted
  //           FROM replies
  //           where thread = $1;`,
  //     values: [thread],
  //   };

  //   const results = await this._pool.query(query);
    
  //   return results.rows.map(result => {
  //     return new DetailedComment({ ...result });
  //   })
  // }
}

module.exports = ReplyRepositoryPostgres;
