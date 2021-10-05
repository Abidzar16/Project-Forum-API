const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (result.rowCount == 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    
    if (result.rows[0].owner != owner) {
      throw new AuthorizationError('anda tidak memiliki comment ini');
    }
  }

  async checkCommentThreadRelation(thread, comment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (result.rowCount == 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    if (result.rows[0].thread != thread) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addComment(createComment) {
    const { content, owner, thread } = createComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comments(id, content, owner, thread, is_deleted) 
            VALUES ($1, $2, $3, $4, false) 
            RETURNING id, content, owner`,
      values: [id, content, owner, thread],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async deleteComment(selectedComment) {
    const query = {
      text: `UPDATE comments
            SET is_deleted = true
            WHERE id = $1;`,
      values: [selectedComment],
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
