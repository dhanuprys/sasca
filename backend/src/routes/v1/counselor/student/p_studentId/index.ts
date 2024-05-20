'use strict'

import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../../blueprint';
import { FastifyReply } from 'fastify';
import CounselorClassesModel from '../../../../../models/CounselorClassesModel';
import StudentModel from '../../../../../models/StudentModel';

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
      // const { entity_id } = request.user as JWTUserPayload;
      const { studentId } = request.params as { studentId: number };

      const student = await StudentModel.getStudentById(studentId);

      if (!student) {
        return reply.code(404).send({
          message: 'Student not found'
        });
      }

      return reply.send(student);
    });
}

export default handler;
