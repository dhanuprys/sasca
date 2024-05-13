'use strict'

import * as yup from 'yup';
import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../blueprint';
import { FastifyReply } from 'fastify';
import { DateTime } from 'luxon';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      onRequest: [
        fastify.authenticated
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const now = DateTime.now().plus({ second: 5 });

      return {
        iso: now.toISO(),
        date: now.toFormat('YYYY-MM-dd'),
        time: now.toFormat('HH:mm:ss')
      }
    });
}

export default handler;
