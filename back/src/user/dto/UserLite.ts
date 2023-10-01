import { User, UserStatus } from '@prisma/client';

// export class UserLite {
// 	login: string;
// 	pseudo: string;
// 	id: number;
// 	status: UserStatus;
// }
// # User
// ## Unauthenticated
export type UserLite = Pick<
  User,
  'login' | 'pseudo' | 'id' | 'status'
>;

export type UserLiteSelectType = {
  [K in keyof UserLite]: boolean;
};

export const UserLiteSelect: UserLiteSelectType = {
  login: true,
  pseudo: true,
  id: true,
  status: true,
};

// ## With Auth
export type AuthUser = Pick<
  User,
  'login' | 'pseudo' | 'id' | 'status' | 'twoFA' | 'is2FAAuthenticated' | 'rank'
>;

export type AuthUserSelectType = {
  [K in keyof AuthUser]: boolean;
};

export const AuthUserSelect: AuthUserSelectType & { chromas: boolean } = {
  login: true,
  pseudo: true,
  id: true,
  status: true,
  twoFA: true,
  is2FAAuthenticated: true,
  rank: true,
  chromas: true,
};
