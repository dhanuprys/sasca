import { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as faceapi from 'face-api.js';
import Roles from './constant/Roles';

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

export type FastifyCustomRequestScheme<TReqBody = any> = FastifyRequest & FastifyJWT & { body: TReqBody };
export type FastifyExtendedInstance = FastifyInstance 
                                      & AuthenticatedDecoration 
                                      // & IStorageHandler
                                      & {
                                        faceapi: typeof faceapi
                                      };

export const UserRoles = ['admin', 'student', 'counseling'] as const;

export type UserRolesType = typeof UserRoles[number];