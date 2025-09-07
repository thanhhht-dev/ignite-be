import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export { hashPassword };
