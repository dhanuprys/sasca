'use strict'

import {
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../../../blueprint';
import { FastifyReply } from 'fastify';
import AttendanceModel from '../../../../../../models/AttendanceModel';
import createSchema from '../../../../../../utils/schema';
import AttendanceStatus from '../../../../../../constant/AttendanceStatus';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: createSchema((yup) => ({
          date: yup.string().nullable(),
          month: yup.number().nullable(),
          year: yup.number().nullable()
        }))
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
      const { studentId } = request.params as { studentId: number };
      const { date, month, year } = request.query as { date: string, month: number, year: number };

      // Mendapatkan jadwal libur pada bulan ini
      let attendances = null;

      if (date) {
        attendances = await AttendanceModel.getStudentByDate(studentId, date);
      } else {
        attendances = await AttendanceModel.getMonthlyReport(studentId, month, year);
      }

      return reply.send(attendances);
    });

    fastify.put(
      '/',
      {
        schema: {
          body: createSchema((yup) => ({
            date: yup.string().required(),
            status: yup.string().oneOf(Object.values(AttendanceStatus)).required()
          }))
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
        const { studentId } = request.params as { studentId: number };
        const { date, status } = request.body as { date: string, status: string };
  
        const result = await AttendanceModel.addOrUpdateStatus(studentId, date, status);
  
        return reply.send(result);
      });
}

export default handler;
