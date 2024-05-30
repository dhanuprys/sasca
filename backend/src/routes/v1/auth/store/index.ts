'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance,
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import AccountModel from '../../../../models/AccountModel';
import createSchema from '../../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  // authenticate credentials
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticated]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { id, entity_id, username, role } = request.user as JWTUserPayload;
      const userSearch = await AccountModel.getUserByEntityId(entity_id, role);

      if (!userSearch) {
        return reply.code(404).send({
          code: 'INVALID_USER_TOKEN'
        });
      }

      const token = await reply.jwtSign({
        id: id,
        entity_id: entity_id,
        username: username,
        role: role
      });

      return reply
        .code(200)
        .send({
          account_token: token
        });
    });

    fastify.post(
      '/',
      {
        schema: {
          body: createSchema((yup) => ({
              token: yup.string().required()
          }))
        }
      },
      async function (
        request: FastifyCustomRequestScheme,
        reply: FastifyReply
      ) {
        const { token } = request.body as { token: string };
        let user: any;

        try {
          user = fastify.jwt.verify(token);
        } catch (error) {
          return reply.code(401).send({
            code: 'TOKEN_EXPIRED'
          });
        }

        const assignedToken = await reply.jwtSign({
          id: user.id,
          entity_id: user.entity_id,
          username: user.username,
          role: user.role
        });
  
        return reply
          .code(200)
          .setCookie('sasca-jwt', token, { path: '/' })
          .send({
            token: assignedToken
          });
      });
}

export default handler;
