/* eslint-disable import/prefer-default-export */
export const userOrdersResponse = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      status: { type: 'string' },
      price: { type: 'number' },
      createdAt: { type: 'string' },
    },
  },
};
