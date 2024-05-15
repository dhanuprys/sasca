'use strict'

import type { FastifyExtendedInstance, JWTUserPayload } from '../../../blueprint';
import AccountModel from '../../../models/AccountModel';
import createSchema from '../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: createSchema((yup) => ({
          all: yup.boolean().required().default(false)
        }))
      },
      onRequest: [fastify.authenticated]
    },
    async function (request, reply) {
      const { all } = request.query as { all: boolean };
      const { entity_id, role } = request.user as JWTUserPayload;
      const userSearch = await AccountModel.getUserByEntityId(entity_id, role, all);

      return reply.send({
        role,
        user: userSearch
      });
  });
}

export default handler;