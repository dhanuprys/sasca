import fp from 'fastify-plugin';
import throttle from '@fastify/throttle';

export default fp(async function (fastify) {
  await fastify.register(throttle);
});