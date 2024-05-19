'use strict'

import type { FastifyExtendedInstance } from '../../../../../blueprint';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get('/', async function (request, reply) {
    const { fileName } = request.params as { fileName: string };

    console.log(fileName);

    return {
      root: true
    }
  });
}

export default handler;