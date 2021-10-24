require('hapi-rate-limit');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    config: {
      plugins: {
        'hapi-rate-limit': {
          pathLimit: false
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    config: {
      plugins: {
        'hapi-rate-limit': {
          pathLimit: false
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
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
