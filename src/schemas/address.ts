import { enumToArray, UserAddressType } from '@getf1tickets/sdk';

export const userAddressResponseSchema = {
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
};

export const userAddressCreationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['type', 'fullName', 'phoneNumber', 'address', 'city', 'zip', 'country'],
  properties: {
    type: { enum: enumToArray(UserAddressType, true) },
    fullName: { type: 'string' },
    phoneNumber: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    zip: { type: 'string' },
    country: { type: 'string' },
  },
};
