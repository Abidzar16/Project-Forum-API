const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

const CreateLike = require('../../../Domains/likes/entities/CreateLike');

const pool = require('../../database/postgres/pool');

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding2' });
    await UsersTableTestHelper.addUser({id: 'user-234', username: 'dicoding3' });
    await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'user-234' });
    await CommentsTableTestHelper.addComment({id: 'comment-345', thread: 'thread-123', owner: 'user-234' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('isLikeExist function', () => {
    it('should return Null when like not found', async () => {
      
      // Action & Assert
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const id = await likeRepositoryPostgres.isLikeExist('comment-345','user-123');
      await expect(id).toBe(null);
    });
 
    it('should return like_id when reply is found and owned', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123', comment: 'comment-345', user: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action & Assert
      const id = await likeRepositoryPostgres.isLikeExist('comment-345','user-123');
      await expect(id).toBe('like-123');
    });
  });

  describe('addLike function', () => {
    
    it('should persist create like', async () => {
      // Arrange
      const createReply = new CreateLike({
        thread: 'thread-123',
        comment: 'comment-345',
        user: 'user-234',
      });
      const fakeIdGenerator = () => '987'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await likeRepositoryPostgres.addLike(createReply);
 
      // Assert
      const replies = await LikesTableTestHelper.findLikeById('like-987');
      expect(replies).toHaveLength(1);
    });
  });

  describe('changeLike function', () => {
    it('should change to opposite value', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123', comment: 'comment-345', user: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
 
      // Action
      await likeRepositoryPostgres.changeLike('like-123');
 
      // Assert
      const result = await LikesTableTestHelper.findLikeById('like-123');
      expect(result[0].is_liked).toBeFalsy();
    });
  });

  describe('getLikeByComment function', () => {
    it('should get number of like by comment', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123', comment: 'comment-345', user: 'user-123',
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
 
      // Action
      const result = await likeRepositoryPostgres.getLikeByComment('comment-345');
      // Assert
      expect(parseInt(result, 10)).toBe(1);
    });
  });
})