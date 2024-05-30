'use strict'

import type { FastifyExtendedInstance, JWTUserPayload } from '../../../../../blueprint';
import AccountModel from '../../../../../models/AccountModel';
import createSchema from '../../../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.post(
    '/',
    {
      schema: {
        body: createSchema((yup) => ({
          tokens: yup.mixed().required().default({})
        }))
      }
    },
    async function (request, reply) {
      const { tokens } = request.body as { tokens: any };
      let accounts: any = [];
      // const { entity_id, role } = request.user as JWTUserPayload;

      for (const tokenId in tokens) {
        let user: any;

        try {
          user = fastify.jwt.verify(tokens[tokenId]);
        } catch (error) {
          console.log('skipping');
          // silent
          continue;
        }

        const userSearch = await AccountModel.getUserByEntityId(user.entity_id, user.role);

        if (!userSearch) {
          continue;
        }

        accounts.push({
          id: user.id,
          role: user.role,
          user: userSearch
        })
      }

      return reply.send(accounts);
  });
}

export default handler;