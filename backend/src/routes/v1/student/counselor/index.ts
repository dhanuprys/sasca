'use strict'

import { FastifyReply } from 'fastify';
import type { FastifyCustomRequestScheme, FastifyExtendedInstance, JWTUserPayload } from '../../../../blueprint';
import StudentModel from '../../../../models/StudentModel';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticated]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
    const { entity_id } = request.user as JWTUserPayload;

    const counselor = await StudentModel.getStudentCounselor(entity_id);

    if (!counselor) {
      return reply.code(404).send({
        message: 'Counselor not found'
      });
    }

    return reply.send(counselor);
  });
}

export default handler;