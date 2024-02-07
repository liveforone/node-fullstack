import * as bcrypt from 'bcrypt';

export const encodePassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

export const isMatchPassword = async (
  password: string,
  encodePassword,
): Promise<boolean> => {
  return await bcrypt.compare(password, encodePassword);
};
