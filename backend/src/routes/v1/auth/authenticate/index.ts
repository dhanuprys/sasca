'use strict'

import { 
  CMSContentTypes,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance,
  type JWTUserPayload
} from '../../../../blueprint';
import createSchema from '../../../../utils/schema';
import { createSlug } from '../../../../utils/blog';
import BlogModel, { DB_BlogSchema } from '../../../../models/Blog';
import { FastifyReply } from 'fastify';
import knexDB from '../../../../utils/db';

async function handler(fastify: FastifyExtendedInstance) {
  // authenticate credentials
  fastify.post(
    '/',
    {
      onRequest: [fastify.need_api_key],
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
      type RequestPayload = {
        username: string,
        password: string
      }
      const { username, password }: RequestPayload = request.body;
      const returnNotFound = () => {
        return reply.code(404).send({
          message: 'Akun admin tidak ditemukan'
        });
      };

      const user = await knexDB({ a: 'auth.users' })
        .where({ username })
        .first();

      if (!user) {
        return returnNotFound();
      }

      if (user.encrypted) {
        // encryption logic
        if (true) {
          return returnNotFound();
        }
      } else {
        if (user.password !== password) {
          return returnNotFound();
        }
      }

      // hide password
      delete user.password;

      return reply.code(200).send(user);
    });
}

export default handler;
