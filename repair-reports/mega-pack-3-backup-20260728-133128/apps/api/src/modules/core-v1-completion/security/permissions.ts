export const Permissions = {
  UsersRead: 'users.read',
  UsersWrite: 'users.write',
  RolesRead: 'roles.read',
  RolesWrite: 'roles.write',
  PermissionsRead: 'permissions.read',
  PermissionsWrite: 'permissions.write',
  SessionsRead: 'sessions.read',
  SessionsWrite: 'sessions.write',
  ApiKeysRead: 'api-keys.read',
  ApiKeysWrite: 'api-keys.write',
  TokensRead: 'tokens.read',
  TokensWrite: 'tokens.write',
  IdentityDashboardRead: 'identity.dashboard.read',
  SystemAdmin: 'system.admin',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];