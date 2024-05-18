'use strict'

import * as yup from 'yup';
import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import AttendanceModel from '../../../../models/AttendanceModel';
import AttendanceRank from '../../../../models/AttendanceRank';

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
        fastify.only_allowed_roles(['student'])
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { entity_id } = request.user as JWTUserPayload;
      // const { month, year } = request.query as { month: number, year: number };

      // Mendapatkan jadwal libur pada bulan ini
      const ranks = await AttendanceRank.getRanks(100);

      return reply.send(ranks);
    });
}

export default handler;
