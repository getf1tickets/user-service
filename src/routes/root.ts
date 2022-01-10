import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '/:id',
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser(),
    ],
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      reply.send(request.user?.toJSON());
    },
  });
};

export default root;
