'use strict'

import * as yup from 'yup';
import {
  JWTUserPayload,
  type FastifyExtendedInstance
} from '../../../../../blueprint';
import canvas from 'canvas';
import fs from 'fs-extra';
import { FaceDetection, TNetInput } from 'face-api.js';
import sharp from 'sharp';

async function handler(fastify: FastifyExtendedInstance) {
  /**
   * Melakukan absensi
   */
  fastify.post(
    '/',
    {
      schema: {
        body: yup.object({
          photo: yup.mixed().required()
        }).required()
      },
      onRequest: [
        fastify.authenticated,
        fastify.only_allowed_roles(['student'])
      ]
    },
    async function (request, reply) {
      const { entity_id } = request.user as JWTUserPayload;
      const { photo } = request.body as { photo: Buffer };
      const { faceapi } = fastify;
      const image = await canvas.loadImage(photo);

      /**
       * Menyimpan gambar dan mengembalikan nilai nama file
       * @returns string
       */
      const createFaceSignature = async (result: FaceDetection) => {
        const padding = 20;
        const fileName = `${entity_id}_${result.score}.png`;

        // Meimotong gambar sesuai dengan ukuran wajah untuk optimalisasi
        // pada saat absensi
        const faceBuffer = await sharp(photo).extract({
          width: Math.round(result.box.width) + padding,
          height: Math.round(result.box.height) + (padding+10),
          left: Math.round(result.box.x) - (padding/2),
          top: Math.round(result.box.y) - (padding+5)
        }).toBuffer();

        // Menyimpan hasil potongan wajah ke dalam file
        await fs.outputFile(`./storage/samples/${fileName}`, faceBuffer);

        return fileName;
      }

      const result = await faceapi
        .detectSingleFace(
          image as unknown as TNetInput,
          new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })
        );

      if (!result || result.score <= 0.45) {
        return reply.code(400).send({
          code: 'UNRECOGNIZED',
          message: 'Wajah tidak dapat dideteksi'
        });
      }

      return reply.send({
        signature: fastify.jwt.sign({
          name: await createFaceSignature(result),
          accuracy: result.score
        }),
        score: result.score
      });
    })
}

export default handler;
