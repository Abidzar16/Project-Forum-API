const pool = require('../../database/postgres/pool');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

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
  });

  afterAll(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes/', () => {
    it('should response 200', async () => {
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
      const responseLike = await server.inject({
        method: 'PUT',
        url: '/threads/thread-234/comments/comment-123/likes',
        headers: { 'Authorization': 'Bearer ' + responseToken.data.accessToken},
      });
      
      // Assert
      const responseJson = JSON.parse(responseLike.payload);
      // console.log(responseLike);
      expect(responseLike.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});