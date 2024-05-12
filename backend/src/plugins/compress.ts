import fp from 'fastify-plugin';
import compress from '@fastify/compress';

export default fp(async function (fastify) {
  fastify.register(
    compress,
    {
      encodings: ['deflate', 'br', 'gzip', 'identity']
    }
  );
});