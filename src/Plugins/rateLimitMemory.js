/* eslint-disable init-declarations */
const { RateLimiterMemory } = require('rate-limiter-flexible');
const Boom = require('boom');

const internals = {
  pluginName: 'rateLimitMemoryPlugin',
};

const opts = {
  points: 90, // 90 requests
  duration: 60, // Per minutes
};

internals.rateLimiter = new RateLimiterMemory(opts);

module.exports = {
  name: internals.pluginName,
  version: '1.0.0',
  register (server) {
    server.ext('onPreAuth', async (request, h) => {
      try {
        await internals.rateLimiter.consume(request.info.remoteAddress);
        return h.continue;
      } catch (rej) {
        let error;
        if (rej instanceof Error) {
          // If some Redis error and `insuranceLimiter` is not set
          error = Boom.internal('Try later');
        } else {
          // Not enough points to consume
          error = Boom.tooManyRequests('Rate limit exceeded');
          error.output.headers['Retry-After'] = Math.round(rej.msBeforeNext / 1000) || 60;
        }

        return error;
      }
    });
  }
};