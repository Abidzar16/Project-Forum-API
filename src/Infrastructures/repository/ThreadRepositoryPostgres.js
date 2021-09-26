const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const DetailedThread = require('../../Domains/threads/entities/DetailedThread');

const ThreadRepository = require('../../Domains/threads/ThreadRepository');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread) {
    const { title, body, owner } = createThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(thread) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (result.rowCount == 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThread(thread) {
    const query = {
      text: 'SELECT id, title, body, date, owner FROM threads WHERE id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (result.rowCount == 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    
    return new DetailedThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
