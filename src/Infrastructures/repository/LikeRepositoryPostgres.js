const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isLikeExist(comment, user) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment = $1 AND "user" = $2',
      values: [comment, user],
    };

    const result = await this._pool.query(query);
    // console.log(result.rows);
    if (result.rowCount == 0) {
      return null
    }

    return result.rows[0].id;
  }

  async addLike(createLike) {
    const { comment, user } = createLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO likes(id, comment, "user") 
            VALUES ($1, $2, $3)`,
      values: [id, comment, user],
    };

    await this._pool.query(query);
  }

  async changeLike(selectedLike) {
    const query = {
      text: `UPDATE likes
            SET "is_liked" = NOT "is_liked"
            WHERE id = $1;`,
      values: [selectedLike],
    };

    await this._pool.query(query);
  }

  async getLikeByComment(comment) {

    const query = {
      text: `SELECT COUNT(*) as likes
            FROM likes
            where comment = $1 AND is_liked = true;`,
      values: [comment],
    };

    var results = await this._pool.query(query);
    return results.rows[0].likes;
  }
}

module.exports = LikeRepositoryPostgres;