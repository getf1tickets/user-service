import { User, UserAddress } from '@getf1tickets/sdk';
import to from 'await-to-js';
import { FastifyPluginAsync } from 'fastify';
import { userAddressCreationSchema, userAddressResponseSchema } from '../schemas/address';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.route<{
    Body: {
      type: string,
      fullName: string,
      phoneNumber: string,
      address: string,
      city: string,
      state: string,
      zip: string,
      country: string,
    }
  }>({
    method: 'POST',
    url: '/:id/address',
    schema: {
      body: userAddressCreationSchema,
      response: {
        201: userAddressResponseSchema,
      },
    },
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser(),
    ],
    handler: async (request, reply) => {
      const [err, address] = await to(request.user.createAddress(request.body as any));

      if (err) {
        fastify.log.error(err);
        throw fastify.httpErrors.internalServerError();
      }

      reply.status(201).send(address?.toJSON());
    },
  });

  fastify.route<{
    Params: {
      addressId: string,
    }
  }>({
    method: 'DELETE',
    url: '/:id/address/:addressId',
    preHandler: [
      fastify.authentication.authorize(),
      fastify.middlewares.useUser(),
    ],
    handler: async (request, reply) => {
      const [err, address] = await to<UserAddress>(UserAddress.findOne({
        where: {
          id: request.params.addressId,
        },
        include: [
          {
            model: User,
            as: 'user',
            where: {
              id: request.user.id,
            },
          },
        ],
      }));

      if (err) {
        fastify.log.error(err);
        throw fastify.httpErrors.internalServerError();
      }

      if (!address) {
        throw fastify.httpErrors.notFound();
      }

      const [err2] = await to(address.destroy());
      if (err2) {
        fastify.log.error(err);
        throw fastify.httpErrors.internalServerError();
      }

      reply.status(204);
    },
  });
};

export default root;
