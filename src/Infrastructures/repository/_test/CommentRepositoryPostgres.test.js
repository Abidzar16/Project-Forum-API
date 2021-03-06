const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

const pool = require('../../database/postgres/pool');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
 
describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding2' });
    await UsersTableTestHelper.addUser({id: 'user-234', username: 'dicoding3' });
    await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'user-234' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyCommentOwnership function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwnership('user-234','comment-567')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthenticationError when comment is not owned', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({id: 'comment-abc', thread: 'thread-123', owner: 'user-234' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
 
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwnership('user-123','comment-abc')).rejects.toThrowError(AuthorizationError);
    });
 
    it('should not throw AuthenticationError NotFoundError when comment found and owned', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({id: 'comment-345', thread: 'thread-123', owner: 'user-234' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
 
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwnership('user-234','comment-345')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('checkCommentThreadRelation function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentThreadRelation('thread-poi','comment-567')).rejects.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when thread found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({id: 'comment-abc', thread: 'thread-123', owner: 'user-234' });
      
      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentThreadRelation('thread-122','comment-abc')).rejects.toThrowError(NotFoundError);
    });
 
    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({id: 'comment-345', thread: 'thread-123', owner: 'user-234' });

      // Action & Assert
      await expect(commentRepositoryPostgres.checkCommentThreadRelation('thread-123','comment-345')).resolves.not.toThrowError(NotFoundError);
    });
  });
 
  describe('addComment function', () => {
    it('should persist create thread', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'dicoding',
        thread: 'thread-123',
        owner: 'user-234',
      });
      const fakeIdGenerator = () => '987'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await commentRepositoryPostgres.addComment(createComment);
 
      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-987');
      expect(comments).toHaveLength(1);
    });
 
    it('should return created comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'dicoding',
        thread: 'thread-123',
        owner: 'user-234',
      });
      const fakeIdGenerator = () => '780'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const createdComment = await commentRepositoryPostgres.addComment(createComment);
 
      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-780',
        content: 'dicoding',
        owner: 'user-234',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({id: 'comment-780', owner: 'user-123'});
      
      const fakeIdGenerator = () => '780'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await commentRepositoryPostgres.deleteComment('comment-780');
 
      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-780');
      expect(comments).toHaveLength(0);
    });
  });

  describe('getCommentByThread function', () => {
    it('should get comment from database by thread od', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({id: 'comment-780', owner: 'user-123', thread: 'thread-123'});
      await CommentsTableTestHelper.addComment({id: 'comment-781', owner: 'user-234', thread: 'thread-123'});
      const fakeIdGenerator = () => '780'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      
      // Action
      const detailedComments = await commentRepositoryPostgres.getCommentByThread('thread-123');
 
      // Assert
      expect(detailedComments).toHaveLength(2);
    });
  });
});