/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'comment-123', content = 'dicoding', comment = 'comment-123', owner = 'user-123', is_deleted = false,
  }) {
    const query = {
      text: `INSERT INTO replies(id, content, owner, comment, is_deleted) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, content, owner`,
      values: [id, content, owner, comment, is_deleted],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
