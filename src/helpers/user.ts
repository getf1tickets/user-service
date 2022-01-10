import { User } from '@getf1tickets/sdk';

export const existUser = async (email: string): Promise<boolean> => {
  const user = await User.findOne({
    where: { email },
  });
  return user !== null;
};

export const a = null;
