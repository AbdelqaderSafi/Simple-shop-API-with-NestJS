import { User } from 'generated/prisma';

export type RegisterDTO = Omit<User, 'id' | 'createdAt'>;

export type UserResponseDTO = {
  token: string;
  userData: Omit<User, 'password' | 'id'> & { id: string };
};

export type LoginDTO = Pick<User, 'email' | 'password'>;
