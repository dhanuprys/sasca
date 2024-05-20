'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../blueprint';
import { FastifyReply } from 'fastify';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        // querystring: createSchema((yup) => ({
        //   month: yup.number().required(),
        //   year: yup.number().required()
        // }))
      },
      onRequest: [
        // fastify.authenticated,
        // fastify.only_allowed_roles(['counselor'])
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      // const { entity_id } = request.user as JWTUserPayload;

      return reply.send({});
    });
}

export default handler;
