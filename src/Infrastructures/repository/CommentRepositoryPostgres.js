const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const DetailedComment = require('../../Domains/comments/entities/DetailedComment');

const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentOwnership(owner, comment) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (result.rowCount == 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    if (result.rows[0].id == owner) {
      throw new AuthenticationError('anda tidak memiliki comment ini');
    }
  }

  async addComment(createComment) {
    const { content, owner, thread } = createComment;
    const id = `comment-${this._idGenerator()}`;
    const is_deleted = false; // defauit

    const query = {
      text: `INSERT INTO comments(id, content, owner, thread, is_deleted) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, content, owner`,
      values: [id, content, owner, thread, is_deleted],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async deleteComment(selectedComment) {
    const is_deleted = true;

    const query = {
      text: `UPDATE comments
            SET is_deleted = $1
            WHERE id = $2;`,
      values: [is_deleted, selectedComment],
    };

    await this._pool.query(query);
  }

  async getCommentByThread(thread) {

    const query = {
      text: `SELECT id, content, owner, date, is_deleted
            FROM comments
            where thread = $1;`,
      values: [thread],
    };

    const results = await this._pool.query(query);
    
    return results.rows.map(result => {
      return new DetailedComment({ ...result });
    })
  }
}

module.exports = CommentRepositoryPostgres;
