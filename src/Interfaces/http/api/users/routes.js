require('hapi-rate-limit');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    config: {
      plugins: {
        'hapi-rate-limit': {
          pathLimit: false
        }
      }
    }
  },
]);

module.exports = routes;
