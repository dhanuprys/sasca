'use strict'

import * as yup from 'yup';
import { FastifyCustomRequestScheme, UserRoles } from '../../../../blueprint';
import { checkAccountRole } from '../../../../utils/account';
import knex from '../../../../utils/db';
import type { FastifyExtendedInstance } from '../../../../blueprint';
import { FastifyReply } from 'fastify';

async function handler(fastify: FastifyExtendedInstance) {
  fastify.post(
    '/',
    {
      onRequest: [fastify.need_api_key],
      schema: {
        body: yup.object({
          name: yup.string().required(),
          token: yup.string().required(),
          provider_id: yup.string().required(),
          provider_name: yup.string().required(),
          email: yup.string().required(),
          role: yup.string().oneOf(UserRoles)
        }).required()
      }
    },
    async (
      request: FastifyCustomRequestScheme,
      reply: FastifyReply
    ) => {
      const {
        name,
        token: userToken,
        provider_id: providerId,
        provider_name: providerName,
        email,
        role
      } = request.body;
      let user = await knex({ a: 'auth.accounts' }).where({ token: userToken }).first();
      const returningFields = ['id', 'provider_id', 'is_family', 'is_admin', 'role'];

      // Jika user tidak ditemukan maka data akan langsung dibuat
      if (!user) {
        user = (await knex({ a: 'auth.accounts' })
          .insert({
            name,
            token: userToken,
            provider_id: providerId,
            provider_name: providerName,
            email,
            role: checkAccountRole(providerName, email, role),
            created_at: knex.raw('CURRENT_TIMESTAMP'),
            updated_at: knex.raw('CURRENT_TIMESTAMP')
          }, returningFields))[0];
        // } catch (err) {
        //   return reply.code(500).send({
        //     message: 'Database insert error'
        //   });
        // }
      } else {
        try {
          user = (await knex({ a: 'auth.accounts' })
            .where({ id: user.id })
            .update({
              name,
              email,
              role: checkAccountRole(providerName, email, role),
              updated_at: knex.raw('CURRENT_TIMESTAMP')
            }, returningFields))[0]
        } catch (err) {
          return reply.code(500).send({
            message: 'Database update error'
          })
        }
      }

      const token: string = await reply.jwtSign({
        uid: user.id,
        role: user.role
      });

      return reply.code(201).setCookie('stemsi-jwt', token, {
        sameSite: 'none',
        secure: true
      }).send({
        token
      })
    })
}

export default handler;