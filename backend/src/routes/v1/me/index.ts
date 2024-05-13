'use strict'

import type { FastifyExtendedInstance } from '../../../blueprint';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticated]
    },
    async function (request, reply) {
      return reply.send(request.user);
  });
}

export default handler;