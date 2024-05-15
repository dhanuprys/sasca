'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../../blueprint';
import { FastifyReply } from 'fastify';
import AttendanceSummaryModel from '../../../../../models/AttendanceSummaryMode';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
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

      const attendanceSummary = await AttendanceSummaryModel.getAllStatuses(entity_id);

      if (!attendanceSummary) {
        return reply.code(404).send({
          code: 'SUMMARY_NOT_FOUND',
          message: 'Ringkasan tidak ditemukan'
        });
      }

      return reply.send(attendanceSummary);
    });
}

export default handler;
