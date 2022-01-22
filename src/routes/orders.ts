import { Order } from '@getf1tickets/sdk';
import { FastifyPluginAsync } from 'fastify';
import { userOrdersResponse } from '../schemas/order';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '/:id/orders',
    schema: {
      response: {
        200: userOrdersResponse,
      },
    },
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser(),
    ],
    handler: async (request) => {
      const orders = await fastify.to500(Order.findAll({
        where: {
          userId: request.user.id,
        } as any,
        order: [
          ['createdAt', 'DESC'],
        ],
      }));

      return orders.map((order) => ({
        id: order.id,
        status: order.status,
        price: order.total,
        createdAt: order.createdAt,
      }));
    },
  });
};

export default root;
