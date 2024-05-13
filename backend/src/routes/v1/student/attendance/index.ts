'use strict'

import * as yup from 'yup';
import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import knexDB from '../../../../utils/db';
import shuffleArray from 'shuffle-array';
import AttendanceModel from '../../../../models/AttendanceModel';
import createSchema from '../../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: createSchema((yup) => ({
          type: yup.mixed().oneOf(['in', 'out', 'all']).default('all')
        }))
      },
      onRequest: [
        fastify.authenticated,
        fastify.only_allowed_roles(['student'])
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { entity_id } = request.user as JWTUserPayload;
      const { type: checkType } = request.query as { type: string };

      const attendance = await AttendanceModel.getCheckPoint(checkType, entity_id);

      return reply.send(attendance);
    });

  fastify.post(
    '/',
    {
      schema: {
        body: yup.object({
          signatures: yup.array().required()
        }).required()
      },
    },
    async function (request, reply) {
    });
}

export default handler;
