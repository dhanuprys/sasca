'use strict'

import type { FastifyExtendedInstance } from '../blueprint';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get('/', async function (request, reply) {
    return {
      root: true
    }
  });
}

export default handler;