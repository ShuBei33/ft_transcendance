import { User, UserStatus } from '@prisma/client';

// export class UserLite {
// 	login: string;
// 	pseudo: string;
// 	id: number;
// 	status: UserStatus;
// }

export type UserLite = Pick<
  User,
  'login' | 'pseudo' | 'id' | 'status' | 'twoFA' | 'is2FAAuthenticated'
>;

export interface UserLiteSelect {
  login: boolean;
  pseudo: boolean;
  id: boolean;
  status: boolean;
  twoFA: boolean;
  is2FAAuthenticated: boolean;
}
