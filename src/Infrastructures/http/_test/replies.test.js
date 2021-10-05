const pool = require('../../database/postgres/pool');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);

    const response_user = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    
    const response_user_json = await JSON.parse(response_user.payload);
    const owner = await response_user_json.data.addedUser.id;

    await ThreadsTableTestHelper.addThread({
      id : 'thread-234', title : 'dicoding', body : 'secret', owner,
    });
    await CommentsTableTestHelper.addComment({
      id : 'comment-123', content : 'dicoding', thread : 'thread-234', owner, is_deleted : false,
    });
    await RepliesTableTestHelper.addReply({
      id : 'replies-aaa', content : 'dicoding',  comment : 'comment-123', owner, is_deleted : false,
    });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies/', () => {
    it('should response 201 and persisted comment', async () => {
      const server = await createServer(container);

      // Arrange
      const payload = {
        content: 'dicoding',
      };
      
      const response_before = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      
      const responseToken = JSON.parse(response_before.payload);

      // Action
      const responseReply = await server.inject({
        method: 'POST',
        url: '/threads/thread-234/comments/comment-123/replies',
        payload,
        headers: { 'Authorization': 'Bearer ' + responseToken.data.accessToken},
      });
      
      // Assert
      const responseJson = JSON.parse(responseReply.payload);
      
      expect(responseReply.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and deleted comment', async () => {
      const server = await createServer(container);

      // Arrange
      const response_before = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      
      const responseToken = JSON.parse(response_before.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-234/comments/comment-123/replies/replies-aaa`,
        headers: { 'Authorization': 'Bearer ' + responseToken.data.accessToken },
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
