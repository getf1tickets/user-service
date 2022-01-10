import * as bcrypt from 'bcrypt';

export const hash = async (input: string): Promise<string> => {
  const { BCRYPT_SALT_ROUND = '5' } = process.env;
  return bcrypt.hash(input, parseInt(BCRYPT_SALT_ROUND, 10));
};

export const compareHash = async (
  input: string,
  hasha: string,
): Promise<boolean> => bcrypt.compare(input, hasha);
