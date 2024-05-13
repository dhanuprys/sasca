'use strict'

import {
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import knexDB from '../../../../utils/db';
import SchoolDayScheduleModel from '../../../../models/SchoolDayScheduleModel';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      // Mendapatkan jadwal hari ini
      const todaySchedule = await SchoolDayScheduleModel.getToday();

      if (!todaySchedule) {
        return reply.code(404).send({
          message: 'Jadwal untuk hari ini tidak ditemukan'
        });
      }

      return reply.send(todaySchedule);
    });
}

export default handler;
