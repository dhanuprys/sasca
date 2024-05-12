import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';

export default fp(async function (fastify) {
  fastify.register(multipart, {
    // attachFieldsToBody: 'keyValues',
    // limits: {
    //   fileSize: 5 * 1000000
    // }
  });
});