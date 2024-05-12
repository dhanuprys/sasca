import { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ApplicationStorage } from './plugins/storage';

interface AuthenticatedDecoration {
  authenticated: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  need_api_key: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  auth_safeerror: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  only_allowed_roles: (roles: UserRolesType[]) => 
                          (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  auth_familyonly: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
  auth_adminonly: (request: FastifyCustomRequestScheme, reply: FastifyReply) => Promise<any>
}

interface IStorageHandler {
  STORAGE_BASEPATH: string;
  storage: ApplicationStorage;
}

export interface JWTUserPayload {
  uid: number
  role: 'admin' | 'family'
}

export type FastifyCustomRequestScheme<TReqBody = any> = FastifyRequest & FastifyJWT & { body: TReqBody };
export type FastifyExtendedInstance = FastifyInstance & AuthenticatedDecoration & IStorageHandler;

export const UserRoles = ['admin', 'family'] as const;
export const CMSContentTypes = ['news', 'blog', 'announcement'] as const;

export type UserRolesType = typeof UserRoles[number];
export type CMSType = typeof CMSContentTypes[number];