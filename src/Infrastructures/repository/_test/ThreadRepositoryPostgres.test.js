// const {describe, beforeAll, afterEach, afterAll, it} = require('jest');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');

const pool = require('../../database/postgres/pool');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({id: 'user-234', username: 'dicoding2' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });
 
  describe('addThread function', () => {
    it('should persist create thread', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'dicoding',
        body: 'secret_password',
        owner: 'user-234',
      });
      const fakeIdGenerator = () => 'abc'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await threadRepositoryPostgres.addThread(createThread);
 
      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-abc');
      expect(threads).toHaveLength(1);
    });
 
    it('should return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'dicoding',
        body: 'secret_password',
        owner: 'user-234',
      });
      const fakeIdGenerator = () => 'cde'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread);
 
      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-cde',
        title: 'dicoding',
        owner: 'user-234',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
 
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123a')).rejects.toThrowError(NotFoundError);
    });
 
    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'user-234' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
 
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThread function', () => {
    it('should return detailed version of thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread('thread-123')).rejects.toThrowError(NotFoundError);
    });
 
    it('should return detailed version of thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({id: 'thread-123', title: 'judul', body: 'bodi thread', owner: 'user-234',});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailedThread = await threadRepositoryPostgres.getThread('thread-123');
 
      // Assert
      expect(detailedThread).toHaveProperty('id');
      expect(detailedThread).toHaveProperty('title');
      expect(detailedThread).toHaveProperty('body');
      expect(detailedThread).toHaveProperty('owner');
      expect(detailedThread).toHaveProperty('date');
    });
  });
});