const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');

const pool = require('../../database/postgres/pool');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
 
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

  // describe('verifyCommentOwnership function', () => {
  //   it('should throw NotFoundError when thread not found', async () => {
  //     const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
  //     // Action & Assert
  //     await expect(commentRepositoryPostgres.verifyCommentOwnership('user-234','comment-567')).rejects.toThrowError(NotFoundError);
  //   });

  //   it('should throw NotFoundError when thread found', async () => {
  //     // Arrange
  //     await CommentsTableTestHelper.addComment({id: 'comment-abc', thread: 'thread-123', owner: 'user-234' });
  //     const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
 
  //     // Action & Assert
  //     await expect(commentRepositoryPostgres.verifyCommentOwnership('user-123','comment-abc')).resolves.not.toThrowError(AuthenticationError);
  //   });
 
  //   it('should not throw NotFoundError when thread found', async () => {
  //     // Arrange
  //     await CommentsTableTestHelper.addComment({id: 'comment-345', thread: 'thread-123', owner: 'user-234' });
  //     const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
 
  //     // Action & Assert
  //     await expect(commentRepositoryPostgres.verifyCommentOwnership('user-234','comment-345')).resolves.not.toThrowError(NotFoundError);
  //   });
  // });

  
 
  describe('addReply function', () => {
    it('should persist create thread', async () => {
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

  // describe('deleteComment function', () => {
  //   it('should delete comment from database', async () => {
  //     // Arrange
  //     await CommentsTableTestHelper.addComment({id: 'comment-780', owner: 'user-123'});
      
  //     const fakeIdGenerator = () => '780'; // stub!
  //     const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
 
  //     // Action
  //     await commentRepositoryPostgres.deleteComment('comment-780');
 
  //     // Assert
  //     const comments = await CommentsTableTestHelper.findCommentById('comment-780');
  //     expect(comments).toHaveLength(0);
  //   });
  // });

  // describe('getCommentByThread function', () => {
  //   it('should get comment from database by thread od', async () => {
  //     // Arrange
  //     await CommentsTableTestHelper.addComment({id: 'comment-780', owner: 'user-123', thread: 'thread-123'});
  //     await CommentsTableTestHelper.addComment({id: 'comment-781', owner: 'user-234', thread: 'thread-123'});
  //     const fakeIdGenerator = () => '780'; // stub!
  //     const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      
  //     // Action
  //     const detailedComments = await commentRepositoryPostgres.getCommentByThread('thread-123');
 
  //     // Assert
  //     expect(detailedComments).toHaveLength(2);
  //   });
  // });
});