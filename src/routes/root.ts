import to from 'await-to-js';
import { FastifyPluginAsync } from 'fastify';
import { User } from '@getf1tickets/sdk';
import { existUser } from '../helpers/user';
import { hash } from '@/utils/string';
import { userResponseSchema, userCreationSchema } from '../schemas/user';

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
      const [err, exist] = await to(existUser(request.body.email));

      if (err) {
        fastify.log.error(err);
        throw fastify.httpErrors.internalServerError();
      }

      if (exist) {
        throw fastify.httpErrors.conflict();
      }

      const [err2, user] = await to(User.create({
        email: request.body.email,
        hashedPassword: await hash(request.body.password),
      }));

      if (err2) {
        fastify.log.error(err2);
        throw fastify.httpErrors.internalServerError();
      }

      reply.status(201).send(user?.toJSON());
    },
  });
};

export default root;
