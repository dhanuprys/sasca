import { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as faceapi from 'face-api.js';
import Roles from './constant/Roles';
import Queue from 'bull';
import { ComputeSingleFaceDescriptorTask, FaceDetection, FaceLandmarks68, WithFaceLandmarks } from 'face-api.js';

interface AuthenticatedDecoration {
  authenticated: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  need_api_key: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  auth_safeerror: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  only_allowed_roles: (roles: UserRolesType[]) =>
    (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  auth_adminonly: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
}

// interface IStorageHandler {
//   STORAGE_BASEPATH: string;
//   storage: ApplicationStorage;
// }

export interface JWTUserPayload {
  id: number;
  entity_id: number;
  username: string;
  role: Roles;
}

export type SampleDescriptor = ComputeSingleFaceDescriptorTask<WithFaceLandmarks<{
  detection: FaceDetection;
}, FaceLandmarks68>>;

export type SampleProperty = {
  width: number;
  height: number;
  descriptor: SampleDescriptor
}

type FaceSamples = {
  [studentId: number]: SampleProperty[]
};

export type FastifyCustomRequestScheme<TReqBody = any> = FastifyRequest & FastifyJWT & { body: TReqBody };
export type FastifyExtendedInstance = FastifyInstance
  & AuthenticatedDecoration
  & { subscriptions: any[] }
  // & IStorageHandler
  & {
    faceapi: typeof faceapi;
    faceSamples: FaceSamples;
    loadFaceSample: (studentId: number) => Promise<void>;
  };

export const UserRoles = ['admin', 'student', 'counselor'] as const;

export type UserRolesType = typeof UserRoles[number];

export interface CronJobItem {
  name: string;
  description: string;
  executor: () => Promise<void> | void;
  schedule: string;
}

export interface QueueJobItem {
  name: string;
  description: string;
  queue: {
    instance: Queue.Queue,
    processor: Queue.ProcessCallbackFunction<any>
  }
}