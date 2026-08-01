export const Permissions = {
  UsersRead: 'users.read',
  UsersWrite: 'users.write',
  RolesRead: 'roles.read',
  RolesWrite: 'roles.write',
  SystemAdmin: 'system.admin',
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions];