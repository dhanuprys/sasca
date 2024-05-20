'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import CounselorClassesModel from '../../../../models/CounselorModel';

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
        fastify.authenticated,
        fastify.only_allowed_roles(['counselor'])
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { entity_id } = request.user as JWTUserPayload;

      const classes = await CounselorClassesModel.getCounselorClasses(entity_id);

      if (!classes) {
        return reply.code(404).send({
          message: 'Classroom not found'
        });
      }

      return reply.send(classes);
    });
}

export default handler;
