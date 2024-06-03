'use strict'

import { nanoid } from 'nanoid';
import {
  JWTUserPayload,
  type FastifyCustomRequestScheme,
  type FastifyExtendedInstance
} from '../../../blueprint';
import webPush from 'web-push';
import createSchema from '../../../utils/schema';
import StudentModel from '../../../models/StudentModel';

async function handler(fastify: FastifyExtendedInstance) {
  let subscriptions: { [key: string]: any } = {};

  const vapidKeys = {
    publicKey: 'BGDQdixyYHYbR6v9Kfwo8JGYPJWo7bZI3TRx8_Xnt7tTeJIMb8-0HULXYUGOiY7xR_ygvtdSV79UzeDAHFNLATY',
    privateKey: 'FGeI9ENAPg2MuM4fW6N2ysGOVIc89YjX0EWkE65i5Y0'
  };

  webPush.setVapidDetails(
    'mailto:dhanuprys@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  fastify.log.info('Registering web-push');

  fastify.post(
    '/subscribe',
    {
      onRequest: [fastify.authenticated]
    },
    (
      request,
      reply
    ) => {
      const { role, entity_id } = request.user as JWTUserPayload;
      const subscription = request.body;
      const subscriptionId = nanoid(5);

      subscriptions[subscriptionId] = {
        role,
        entityId: entity_id,
        metadata: subscription
      };

      fastify.log.info('Someone subscribing: ' + subscriptionId);

      reply.status(201).send({
        id: subscriptionId,
        message: 'Subscription received'
      });
    });

  fastify.post(
    '/check',
    {
      schema: {
        body: createSchema((yup) => ({
          subscription_id: yup.string().required()
        }))
      }
    },
    (
      request,
      reply
    ) => {
      const { subscription_id } = request.body as { subscription_id: string };

      const currentSubscription = subscriptions[subscription_id];

      if (!currentSubscription) {
        return reply.code(404).send({
          message: 'Subscription object not found'
        });
      }

      reply.status(200).send(currentSubscription);
    });

  fastify.post(
    '/renew',
    {
      schema: {
        body: createSchema((yup) => ({
          subscription_id: yup.string().required()
        }))
      },
      onRequest: [fastify.authenticated]
    },
    (
      request,
      reply
    ) => {
      const { role, entity_id } = request.user as JWTUserPayload;
      const { subscription_id } = request.body as { subscription_id: string };

      const currentSubscription = subscriptions[subscription_id];

      if (!currentSubscription) {
        return reply.code(404).send({
          message: 'Subscription object not found'
        });
      }

      subscriptions[subscription_id] = {
        role,
        entityId: entity_id,
        metadata: currentSubscription.metadata
      }

      reply.status(201).send({
        message: 'Subscription updated'
      });
    });

  /**
   * BODY
   * recipient
   *  type: string
   *  id: string
   * notification
   *  title: string
   *  body: string
   *  icon: string
   */
  fastify.post(
    '/send-notification',
    {
      schema: {
        body: createSchema((yup) => ({
          key: yup.string().equals([process.env.PUSH_NOTIFICATION_KEY || 'dhanuganteng'], 'KEY NOT VALID').required(),
          recipient: yup.mixed().required(),
          notification: yup.mixed().required()
        }))
      }
    },
    (request, reply) => {
    const payload = request.body as {
      recipient: {
        type: string;
        id: number;
      },
      notification: {
        title: string;
        body: string;
        icon: string;
      }
    };

    if (!payload.recipient) {
      return reply.code(400).send({
        message: 'Bad request'
      })
    }

    const promises = Object.keys(subscriptions).map(async (subscriptionId) => {
      const subscription = subscriptions[subscriptionId];
      let result = null;
      let rowAccepted = false;

      switch (payload.recipient.type) {
        case 'all-student':
          if (subscription.role === 'student') rowAccepted = true;
        break;
        case 'all-counselor':
          if (subscription.role === 'counselor') rowAccepted = true;
        break;
        case 'student':
          if (subscription.role === 'student' && subscription.entityId == payload.recipient.id) rowAccepted = true;
        break;
        case 'counselor':
          if (subscription.role === 'counselor' && subscription.entityId == payload.recipient.id) rowAccepted = true;
        break;
      }

      if (!rowAccepted) return null;

      try {
        result = await webPush.sendNotification(
          subscription.metadata,
          JSON.stringify(payload.notification)
        );

        console.log(result.body);
      } catch (error: any) {
        if (error.statusCode === 410) {
          delete subscriptions[subscriptionId];
        }
      }

      return result;
    });

    Promise.all(promises)
      .then(() =>
        reply.status(200)
            .send({
              message: 'Notification sent',
              client_count: Object.keys(promises.filter(x => x !== null)).length
            }))
      .catch(err => {
        fastify.log.error(err);
        reply.status(500).send({ message: 'Error sending notification' });
      });
  });

  fastify.get(
    '/subscriber/student',
    async (request, reply) => {
      const students = [];

      for (const subscriptionId in subscriptions) {
        const subscription = subscriptions[subscriptionId];

        if (subscription.role !== 'student') continue;

        const student = await StudentModel.getStudentById(subscription.entityId);

        if (!student) continue;

        students.push(student);
      }

      return reply.send(students);
    }
  )
}

export default handler;
