const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

const pool = require('../../database/postgres/pool');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
 
describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding2' });
    await UsersTableTestHelper.addUser({id: 'user-234', username: 'dicoding3' });
    await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'user-234' });
    await CommentsTableTestHelper.addComment({id: 'comment-345', thread: 'thread-123', owner: 'user-234' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyReplyOwnership function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwnership('user-234','reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply found but not owned', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', content: 'dicoding', comment: 'comment-345', owner: 'user-123', is_deleted: false,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
 
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwnership('user-234','reply-123')).rejects.toThrowError(AuthorizationError);
    });
 
    it('should not throw AuthenticationError when reply is found and owned', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', content: 'dicoding', comment: 'comment-345', owner: 'user-123', is_deleted: false,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
 
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwnership('user-123','reply-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });
 
  describe('addReply function', () => {
    it('should persist create reply', async () => {
      // Arrange
      const createReply = new CreateReply({
        content: 'dicoding',
        thread: 'thread-123',
        comment: 'comment-345',
        owner: 'user-234',
      });
      const fakeIdGenerator = () => '987'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await replyRepositoryPostgres.addReply(createReply);
 
      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-987');
      expect(replies).toHaveLength(1);
    });
 
    it('should return created reply correctly', async () => {
      // Arrange
      const createReply = new CreateReply({
        content: 'dicoding',
        thread: 'thread-123',
        comment: 'comment-345',
        owner: 'user-234',
      });
      const fakeIdGenerator = () => '780'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const createdReply = await replyRepositoryPostgres.addReply(createReply);
 
      // Assert
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-780',
        content: 'dicoding',
        owner: 'user-234',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', content: 'dicoding', comment: 'comment-345', owner: 'user-123', is_deleted: false,
      });
      
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
 
      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');
 
      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(0);
    });
  });

  describe('getReplyByComment function', () => {
    it('should get comment from database by thread od', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', content: 'dicoding', comment: 'comment-345', owner: 'user-123', is_deleted: false,
      });
      const fakeIdGenerator = () => '780'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      
      // Action
      const detailedComments = await replyRepositoryPostgres.getReplyByComment('comment-345');
 
      // Assert
      expect(detailedComments).toHaveLength(1);
    });
  });
});