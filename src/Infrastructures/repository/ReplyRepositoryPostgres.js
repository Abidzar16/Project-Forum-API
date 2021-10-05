const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
const DetailedReply = require('../../Domains/replies/entities/DetailedReply');

const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyReplyOwnership(owner, reply) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [reply],
    };

    const result = await this._pool.query(query);

    if (result.rowCount == 0) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    if (result.rows[0].owner != owner) {
      throw new AuthorizationError('anda tidak memiliki reply ini');
    }
  }

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

  async deleteReply(selectedReply) {
    const is_deleted = true;

    const query = {
      text: `UPDATE replies
            SET is_deleted = $1
            WHERE id = $2;`,
      values: [is_deleted, selectedReply],
    };

    await this._pool.query(query);
  }

  async getReplyByComment(comment) {

    const query = {
      text: `SELECT id, content, owner, date, is_deleted
            FROM replies
            where comment = $1;`,
      values: [comment],
    };

    const results = await this._pool.query(query);
    
    return results.rows.map(result => {
      return new DetailedReply({ ...result });
    })
  }
}

module.exports = ReplyRepositoryPostgres;
