'use strict'

import * as yup from 'yup';
import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import knexDB from '../../../../utils/db';
import shuffleArray from 'shuffle-array';
import FaceSampleModel from '../../../../models/FaceSampleModel';

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
      // Mendapatkan daftar sample wajah
      const availability = await FaceSampleModel.isSampleAvailable(entity_id);

      // Jika sampel wajah tidak ditemukan maka respon yang
      // akan diberikan adalah 404
      return reply.code(availability ? 200 : 404).send({
        available: availability
      });
    });

  fastify.post(
    '/',
    {
      schema: {
        body: yup.object({
          signatures: yup.array().required()
        }).required()
      },
      onRequest: [
        fastify.authenticated,
        fastify.only_allowed_roles(['student'])
      ]
    },
    async function (request, reply) {
      const FORCE_COMMIT = true;
      const { entity_id } = request.user as JWTUserPayload;
      const { signatures } = request.body as { signatures: string[] };
      let files = [];

      for (const signature of signatures) {
        try {
          // Jika signature memenuhi syarat, maka signature akan disimpan pada variabel
          files.push(await fastify.jwt.decode(signature));
        } catch (error) {
          return reply.code(400).send({
            code: 'INVALID_SIGNATURE'
          });
        }
      }

      // Jika opsi FORCE COMMIT bernilai true maka perubahan akan dilakukan tanpa memikirkan 
      // apakah siswa sebelumnya masih memiliki sampel wajah atau tidak
      if (!FORCE_COMMIT) {
        const sampleCount = await knexDB('face_samples')
          .where({ student_id: entity_id })
          .count() as number;

        if (sampleCount > 0) {
          return reply.code(409).send({
            code: 'SAMPLE_NOT_EMPTY',
            message: 'Sampel sebelumnya tidak dapat dihapus'
          });
        }
      }

      // Jika jumlah signature sampel tidak berjumalh tiga maka request akan dianggap invalid
      if (files.length !== 3) {
        return reply.code(400).send({
          code: 'INVALID_SAMPLES_COUNT',
          message: 'Ukuran sampel tidak sesuai'
        });
      }

      await knexDB.transaction(async () => {
        // Menghapus semua data yang ada       
        await knexDB('face_samples').where({ student_id: entity_id }).delete();

        // Menyimpan seluruh nama file terkait pada database
        for (const fileMeta of files) {
          await knexDB('face_samples').insert({
            student_id: entity_id,
            sample_path: fileMeta.name,
            accuration: fileMeta.accuracy
          });
        }

        // Menyimpan photo profile secara acak berdasarkan sampel
        knexDB('students')
          .where({ student_id: entity_id })
          .update({ avatar_path: shuffleArray(files)[0].name })
      })

      return reply.send({

      });
    });
}

export default handler;
