import { FastifyPluginAsync } from 'fastify';
import { User, UserInfo } from '@getf1tickets/sdk';
import { existUser } from '../helpers/user';
import { hash } from '@/utils/string';
import { userResponseSchema, userCreationSchema, userUpdateSchema } from '@/schemas/user';
import { userStatsResponse } from '@/schemas/stats';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '/:id',
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser({
        includeAddresses: true,
      }),
    ],
    schema: {
      response: {
        200: userResponseSchema,
      },
    },
    handler: async (request, reply) => {
      reply.send(request.user?.toJSON());
    },
  });

  fastify.route<{
    Body: {
      info?: UserInfo
      password?: {
        oldPassword: string
        newPassword: string
      }
    }
  }>({
    method: 'POST',
    url: '/:id',
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser(),
    ],
    schema: {
      body: userUpdateSchema,
    },
    handler: async (request, reply) => {
      if (request.body.info) {
        await fastify.to500(UserInfo.update({
          ...request.body.info,
        }, {
          where: {
            userId: request.user.id,
          } as any,
        }));
      }

      if (request.body.password) {
        // todo: compare current password hash
        await fastify.to500(request.user.update({
          hashedPassword: await hash(request.body.password.newPassword),
        }));
      }

      reply.status(204);
    },
  });

  fastify.route<{
    Body: {
      email: string,
      password: string
    }
  }>({
    method: 'POST',
    url: '/',
    schema: {
      body: userCreationSchema,
      response: {
        201: userResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const exist = await fastify.to500(existUser(request.body.email));

      if (exist) {
        throw fastify.httpErrors.conflict();
      }

      const user = await fastify.to500(User.create({
        email: request.body.email,
        hashedPassword: await hash(request.body.password),
      }));

      const { firstName, lastName } = request.body as any;
      await fastify.to500(UserInfo.create({
        name: `${firstName} ${lastName}`,
        phoneNumber: '',
        address: '',
        city: '',
        zip: '',
        state: '',
        country: '',
        userId: user.id,
      } as any));

      // notify other services that a new user is created
      await fastify.amqp.publish('user.curd', 'created', user.toJSON());

      reply.status(201).send(user?.toJSON());
    },
  });

  fastify.route({
    method: 'GET',
    url: '/stats',
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser({
        useToken: true,
        shouldBeAdmin: true,
      }),
    ],
    schema: {
      response: {
        200: userStatsResponse,
      },
    },
    handler: async () => {
      const userCount = await fastify.to500(User.count());
      return { totalActiveUser: userCount };
    },
  });
};

export default root;
