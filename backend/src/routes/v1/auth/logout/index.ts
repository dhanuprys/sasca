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
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticated]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      return reply
        .code(200)
        .clearCookie('sasca-jwt', { path: '/' })
        .send({
          
        });
    });
}

export default handler;
