'use strict'

import {
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../blueprint';
import { FastifyReply } from 'fastify';
import knexDB, { knexDBHelpers } from '../../../utils/db';
import SchoolDayScheduleModel from '../../../models/SchoolDayScheduleModel';
import createSchema from '../../../utils/schema';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: createSchema((yup) => ({
          date: yup.string().nullable()
        }))
      }
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { date } = request.query as { date: string };
      // Mendapatkan jadwal hari ini
      const schedule = await SchoolDayScheduleModel.getByDate(
        date || knexDBHelpers.CURRENT_DATE
      );

      if (!schedule) {
        return reply.code(404).send({
          message: `Jadwal untuk tanggal ${date || 'sekarang'} ini tidak ditemukan`
        });
      }

      return reply.send(schedule);
    });

    fastify.post(
      '/',
      {
        schema: {
          body: createSchema((yup) => ({
            dates: yup.array().required(),
            policy: yup.mixed().required()
          }))
        }
      },
      async function (
        request: FastifyCustomRequestScheme,
        reply: FastifyReply
      ) {
        const { dates, policy } = request.body as any; 

        await SchoolDayScheduleModel.createSchedules(dates, policy);

        reply.code(201).send({
          message: 'Created'
        });
      }
    );
}

export default handler;
