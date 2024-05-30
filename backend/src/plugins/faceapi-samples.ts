import fp from 'fastify-plugin';
import { FastifyExtendedInstance, SampleDescriptor, SampleProperty } from '../blueprint';
import FaceSampleModel from '../models/FaceSampleModel';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import { TNetInput } from 'face-api.js';

export default fp(async function (_) {
  const fastify = (_ as FastifyExtendedInstance);

  fastify.faceSamples = {};

  fastify.loadFaceSample = async (studentId: number) => {
    const faceReferences = await FaceSampleModel.getStudentSamples(studentId);

    if (faceReferences.length < 3) return;

    let references: SampleProperty[] = [];

    for (const referenceRow of faceReferences) {
      let reference = (await canvas.loadImage(`./storage/public/samples/${referenceRow.sample_path}`)) as unknown as TNetInput;

      const referenceFace = await faceapi
          .detectSingleFace(reference, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.1 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

      if (!referenceFace) {
        console.log('Failed to resolve');
        continue;
      }

      references.push({
        // @ts-ignore
        width: reference.width,
        // @ts-ignore
        height: reference.height,
        descriptor: referenceFace as unknown as SampleDescriptor
      });
    }

    console.log('Face loaded successfully');
    fastify.faceSamples[studentId] = references;
  }
});