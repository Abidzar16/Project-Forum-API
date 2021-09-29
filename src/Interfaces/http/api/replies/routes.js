const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  // {
  //   method: 'DELETE',
  //   path: '/threads/{threadId}/comments/{commentId}',
  //   handler: handler.deleteCommentHandler,
  //   options: {
  //     auth: 'forumapi_jwt',
  //   },
  // },
]);

module.exports = routes;