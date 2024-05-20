'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../../../blueprint';
import { FastifyReply } from 'fastify';
import AttendanceSummaryModel from '../../../../../../models/AttendanceSummaryModel';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      onRequest: [
        fastify.authenticated,
        fastify.only_allowed_roles(['counselor'])
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { studentId } = request.params as { studentId: number };

      const attendanceSummary = await AttendanceSummaryModel.getAllStatuses(studentId);

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
