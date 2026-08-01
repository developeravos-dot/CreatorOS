import type { Role } from './roles';

export type AuthUser = {
  sub: string;
  username: string;
  roles: Role[];
};