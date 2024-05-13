'use strict'

import {
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance,
  type JWTUserPayload
} from '../../../../blueprint';
import createSchema from '../../../../utils/schema';
import { FastifyReply } from 'fastify';
import AccountModel from '../../../../models/AccountModel';

async function handler(fastify: FastifyExtendedInstance) {
  // authenticate credentials
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticated],
      schema: {
        body: createSchema((yup) => {
          return {
            old_password: yup.string().required(),
            password: yup.string().required()
          }
        }),
      }
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { id } = request.user as JWTUserPayload;
      const { old_password, password } = request.body;

      const user = await AccountModel.changePassword(id, old_password, password);

      // Jika password salah
      if (!user) {
        return reply.code(404).send({
          code: 'WRONG_PASSWORD',
          message: 'Password tidak tepat'
        });
      }
      return reply
        .code(200)
        .send();
    });
}

export default handler;
