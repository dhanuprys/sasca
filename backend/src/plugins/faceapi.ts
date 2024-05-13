import fp from 'fastify-plugin';
import canvas from 'canvas';
import * as faceapi from 'face-api.js';

export default fp(async function (fastify) {
    // @ts-ignore
    faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./face-models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./face-models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./face-models');
    await faceapi.nets.tinyFaceDetector.loadFromDisk('./face-models');

    fastify.decorate('faceapi', faceapi);
});