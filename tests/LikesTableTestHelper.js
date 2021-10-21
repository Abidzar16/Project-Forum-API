const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', comment = 'comment-123', user = 'user-123', is_liked = true,
  }) {
    const query = {
      text: `INSERT INTO likes(id, comment, "user", is_liked) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, comment, "user", is_liked`,
      values: [id, comment, user, is_liked],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;