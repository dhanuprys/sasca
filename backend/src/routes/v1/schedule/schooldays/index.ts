'use strict'

import {
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import SchoolDayScheduleModel from '../../../../models/SchoolDayScheduleModel';
import createSchema from '../../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: createSchema((yup) => ({
          month: yup.number().required(),
          year: yup.number().required()
        }))
      }
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { month, year } = request.query as { month: number, year: number };

      // Mendapatkan jadwal sekolah pada bulan ini
      const holidays = await SchoolDayScheduleModel.getSchooldays(month, year);

      return reply.send(holidays);
    });
}

export default handler;
