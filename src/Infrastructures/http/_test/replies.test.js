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
    const response_user_json = JSON.parse(response_user.payload);
    const owner = response_user_json.data.addedUser.id;

    await ThreadsTableTestHelper.addThread({
      id : 'thread-234', title : 'dicoding', body : 'secret', owner : owner,
    });
    await CommentsTableTestHelper.addComment({
      id : 'comment-123', content : 'dicoding', thread : 'thread-234', owner : owner, is_deleted : false,
    });
    await RepliesTableTestHelper.addReply({
      id : 'replies-123', content : 'dicoding',  comment : 'comment-123', owner : owner, is_deleted : false,
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
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
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
        payload: payload,
        headers: { 'Authorization': 'Bearer ' + responseToken.data.accessToken},
      });
      
      // Assert
      const responseJson = JSON.parse(responseReply.payload);
      
      expect(responseReply.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  // describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
  //   it('should response 200 and deleted comment', async () => {
  //     const server = await createServer(container);

  //     // arrange dummy user
  //     await server.inject({
  //       method: 'POST',
  //       url: '/users',
  //       payload: {
  //         username: 'dicoding',
  //         password: 'secret',
  //         fullname: 'Dicoding Indonesia',
  //       },
  //     });
  
  //     // gain access token
  //     const response_before = await server.inject({
  //       method: 'POST',
  //       url: '/authentications',
  //       payload: {
  //         username: 'dicoding',
  //         password: 'secret',
  //       },
  //     });
  //     const responseToken = JSON.parse(response_before.payload);
      
  //     // arrange dummy thread
  //     const responseThread = await server.inject({
  //       method: 'POST',
  //       url: '/threads',
  //       payload: {
  //         title: 'dicoding',
  //         body: 'secret',
  //       },
  //       headers: { 'Authorization': 'Bearer ' + responseToken.data.accessToken }
  //     });
  
  //     const responseThreadJson = JSON.parse(responseThread.payload);
  //     const threadId = responseThreadJson.data.addedThread.id;
  
  //     const accessToken = responseToken.data.accessToken;
  
  //     // arrange dummy comment
  //     const responseComment = await server.inject({
  //       method: 'POST',
  //       url: `/threads/${threadId}/comments`,
  //       payload: {
  //         content: "this is dummy comment",
  //       },
  //       headers: { 'Authorization': 'Bearer ' + accessToken }
  //     });
  
  //     const responseCommentJson = JSON.parse(responseComment.payload);
  //     const commentId = responseCommentJson.data.addedComment.id;

  //     // Action
  //     const response = await server.inject({
  //       method: 'DELETE',
  //       url: `/threads/${threadId}/comments/${commentId}`,
  //       headers: { 'Authorization': 'Bearer ' + accessToken },
  //     });
      
  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(200);
  //     expect(responseJson.status).toEqual('success');
  //   });
  // });
});
