import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyCustomRequestScheme, JWTUserPayload, UserRolesType } from '../blueprint';
import { FastifyReply } from 'fastify';

export default fp(async function (fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'dinasayangggggg',
    cookie: {
      cookieName: 'sasca-jwt',
      signed: false
    }
  });

  // fastify.decorate(
  //   'need_api_key',
  //   async (
  //     request: FastifyCustomRequestScheme,
  //     reply: FastifyReply
  //   ): Promise<any> => {
  //     if (request.headers['x-api-key'] !== (process.env.API_KEY || 'dhanugantenk')) {
  //       return reply.code(403).send('Access forbidden.');
  //     }
  //   })

  fastify.decorate(
    'authenticated',
    async (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ): Promise<any> => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    })

  fastify.decorate(
    'auth_safeerror',
    async (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ): Promise<any> => {
      try {
        await request.jwtVerify();
      } catch (err) {
        // @ts-ignore
        request.user = null;
      }
    })

  fastify.decorate(
    'only_allowed_roles',
    (roles: UserRolesType[]) => {
      return async (
        request: FastifyCustomRequestScheme,
        reply: FastifyReply
      ): Promise<any> => {
        const user = request.user as unknown as JWTUserPayload;

        // @ts-ignore
        if (user && !roles.includes(user.role)) {
          return reply.code(403).send('Access forbidden.');
        }
      }
    })

  fastify.decorate(
    'auth_adminonly',
    async (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ): Promise<any> => {
      const user = request.user as unknown as JWTUserPayload;

      if (user && user.role !== 'admin') {
        return reply.code(403).send('Access forbidden. Admin only');
      }
    })
});