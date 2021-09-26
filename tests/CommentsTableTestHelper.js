/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'dicoding', thread = 'thread-123', owner = 'user-123', is_deleted = false,
  }) {
    const query = {
      text: `INSERT INTO comments(id, content, owner, thread, is_deleted) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, content, owner`,
      values: [id, content, owner, thread, is_deleted],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
