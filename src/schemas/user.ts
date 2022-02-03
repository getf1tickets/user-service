export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    isAdmin: { type: 'boolean' },
    info: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phoneNumber: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip: { type: 'string' },
        country: { type: 'string' },
      },
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          fullName: { type: 'string' },
          phoneNumber: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          zip: { type: 'string' },
          country: { type: 'string' },
        },
      },
    },
  },
};

export const userCreationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
};

export const userUpdateSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    info: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'phoneNumber', 'address', 'city', 'zip', 'country'],
      properties: {
        name: { type: 'string' },
        phoneNumber: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip: { type: 'string' },
        country: { type: 'string' },
      },
    },
  },
};
