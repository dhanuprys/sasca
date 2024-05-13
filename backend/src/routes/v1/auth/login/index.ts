'use strict'

import {
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance,
  type JWTUserPayload
} from '../../../../blueprint';
import createSchema from '../../../../utils/schema';
import { FastifyReply } from 'fastify';
import knexDB from '../../../../utils/db';
import AccountModel from '../../../../models/AccountModel';

async function handler(fastify: FastifyExtendedInstance) {
  // authenticate credentials
  fastify.post(
    '/',
    {
      schema: {
        body: createSchema((yup) => {
          return {
            username: yup.string().required(),
            password: yup.string().required()
          }
        })
      }
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { username, password } = request.body;

      const user = await AccountModel.authenticate(username, password);

      // Jika user tidak ditemukan
      if (!user) {
        return reply.code(404).send({
          code: 'USER_NOT_FOUND',
          message: 'Akun tidak ditemukan'
        });
      }

      const token = await reply.jwtSign({
        id: user.id,
        entity_id: user.entity_id,
        username: user.username,
        role: user.role
      });

      return reply
        .code(200)
        .setCookie('sasca-jwt', token, { path: '/' })
        .send({
          token
        });
    });
}

export default handler;
