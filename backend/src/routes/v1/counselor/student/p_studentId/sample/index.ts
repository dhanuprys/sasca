'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../../../blueprint';
import { FastifyReply } from 'fastify';
import AttendanceSummaryModel from '../../../../../../models/AttendanceSummaryModel';
import FaceSampleModel from '../../../../../../models/FaceSampleModel';

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

      const samples = await FaceSampleModel.getStudentSamples(studentId);

      if (!samples || samples.length <= 0) {
        return reply.code(404).send({
          code: 'SAMPLES_NOT_FOUND',
          message: 'Sampel wajah tidak ditemukan tidak ditemukan'
        });
      }

      return reply.send(samples);
    });
}

export default handler;
