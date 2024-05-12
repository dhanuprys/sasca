import fp from 'fastify-plugin';
import staticServer from '@fastify/static';
import path from 'path';

export default fp(async function (fastify) {
  fastify.register(staticServer, {
    root: process.env.STORAGE_PUBLIC_PATH || path.join(__dirname, '../../static/public'),
    prefix: '/_static/'
  })
});