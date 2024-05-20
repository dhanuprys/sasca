'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import StudentFeedback from '../../../../models/StudentFeedback';
import createSchema from '../../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: createSchema((yup) => ({
          today: yup.boolean().nullable()
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
      const result = await StudentFeedback.getToday(entity_id);

      if (!result) {
        return reply.code(404).send({
          message: 'Today not found'
        });
      }

      return reply.send(result);
    });

  fastify.post(
    '/',
    {
      schema: {
        body: createSchema((yup) => ({
          stars: yup.number().required(),
          message: yup.string().required(),
          contact: yup.string().nullable()
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
      const { stars, message, contact } = request.body as { stars: number, message: string, contact?: string };

      console.log(contact);

      const result = await StudentFeedback.createFeedback(
        entity_id,
        stars, 
        message,
        contact
      );

      return reply.send({});
    });
}

export default handler;
