export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
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
