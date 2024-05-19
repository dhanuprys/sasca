'use strict'

import * as yup from 'yup';
import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../../blueprint';
import { FastifyReply } from 'fastify';
import canvas from 'canvas';
import AttendanceModel from '../../../../models/AttendanceModel';
import createSchema from '../../../../utils/schema';
import FaceSampleModel from '../../../../models/FaceSampleModel';
import { FaceDetection, FaceLandmarks68, TNetInput, WithFaceDescriptor, WithFaceLandmarks } from 'face-api.js';
import AttendanceNotifier from '../../../../daemon/queue/jobs/AttendanceNotifier';

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
        fastify.only_allowed_roles(['student'])
      ]
    },
    async function (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) {
      const { entity_id } = request.user as JWTUserPayload;
      const { date, month, year } = request.query as { date: string, month: number, year: number };

      // Mendapatkan jadwal libur pada bulan ini
      let attendances = null;

      if (date) {
        attendances = await AttendanceModel.getStudentByDate(entity_id, date);
      } else {
        attendances = await AttendanceModel.getMonthlyReport(entity_id, month, year);
      }

      return reply.send(attendances);
    });

  fastify.post(
    '/',
    {
      schema: {
        body: yup.object({
          type: yup.string().oneOf(['in', 'out']).required(),
          loc_lat: yup.number().required(),
          loc_long: yup.number().required(),
          photo: yup.mixed().required()
        }).required()
      },
      onRequest: [fastify.authenticated, fastify.only_allowed_roles(['student'])]
    },
    async function (request, reply) {
      const { entity_id } = request.user as JWTUserPayload;
      const { faceapi } = fastify;
      const {
        type,
        loc_lat,
        loc_long,
        photo
      } = request.body as { type: 'in' | 'out' | string, loc_lat: number, loc_long: number, photo: Buffer };
      const { notifyStudentAttendance } = AttendanceNotifier.model!;

      console.log('TRAFFIC PROCESS STARTING');

      const faceReferences = await FaceSampleModel.getStudentSamples(entity_id);
      let result = null;

      if (faceReferences.length < 3) {
        return reply.code(404).send({
          code: 'EMPTY_DATASET',
          message: 'Sampel wajah tidak ditemukan'
        });
      }

      const convertToComparableImage = async (inputImage: Buffer): Promise<
        WithFaceDescriptor<WithFaceLandmarks<{
          detection: FaceDetection;
        }, FaceLandmarks68>> | undefined> => {
          console.log('comparable image start');
        let img = await canvas.loadImage(inputImage) as unknown as TNetInput;

        let newFace = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.1 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        return newFace;
      }

      const compare = async (
        referencePath: string,
        compareFace: WithFaceDescriptor<WithFaceLandmarks<{
          detection: FaceDetection;
        }, FaceLandmarks68>> | undefined
      ) => {
        console.log('load reference');
        let reference = (await canvas.loadImage(`./storage/public/samples/${referencePath}`)) as unknown as TNetInput;

        console.log('get reference face descriptor');
        const referenceFace = await faceapi
          .detectSingleFace(reference, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.1 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        console.log(referenceFace);

        // Jika sistem tidak bisa mendeteksi salah satu atau kedua dari reference dan 
        // gambar absensi, maka sistem akan menyatakan kesalahan
        if (!referenceFace || !compareFace) {
          console.log('cant detect reference or compare face');

          return null;
        }

        console.log('start face matcher')
        const faceMatcher = new faceapi.FaceMatcher(referenceFace);

        compareFace = faceapi.resizeResults(compareFace, {
          // @ts-ignore
          width: reference.width,
          // @ts-ignore
          height: reference.height
        });

        if (!compareFace) {
          throw new Error('Face error');
        }

        console.log('comparing');
        const bestMatch = faceMatcher.findBestMatch(compareFace.descriptor);
        const accuracy = 1 - bestMatch.distance;

        console.log({accuracy});

        if (accuracy >= 0.55) {
          return {
            accuracy
          }
        }
      }

      const createAttendance = async () => {
        let result;

        if (type === 'in') {
          result = await AttendanceModel.checkIn(
            entity_id,
            [loc_lat, loc_long]
          );
        }

        if (type === 'out') {
          result = await AttendanceModel.checkOut(
            entity_id,
            [loc_lat, loc_long]
          )
        }
        
        return result;
      };

      const inputImage = await convertToComparableImage(photo);

      for (const reference of faceReferences) {
        try {
          const result = await compare(reference.sample_path as string, inputImage);

          if (!result) continue;

          const attendanceResult = await createAttendance();

          if (!attendanceResult) {
            return reply.code(500).send({
              message: 'Attendance error'
            });
          }

          await notifyStudentAttendance(attendanceResult[0].id);

          return reply.send({
            accuracy: result.accuracy
          });
        } catch (error) {
          console.log(error);
        }
      }

      return reply.code(404).send({
        code: 'UNRECOGNIZED',
        message: 'Wajah tidak dikenali'
      });
    });
}

export default handler;
