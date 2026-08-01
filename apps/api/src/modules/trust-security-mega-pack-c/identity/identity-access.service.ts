import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  AccessDecision,
  AccessRole,
  IdentityUser,
} from '../trust-security.types';

@Injectable()
export class IdentityAccessService {
  private readonly users = new Map<
    string,
    IdentityUser
  >();

  private readonly roles = new Map<
    string,
    AccessRole
  >();

  createRole(input: {
    key: string;
    name: string;
    permissions: string[];
  }) {
    const existing = this.roles.get(input.key);

    if (existing) {
      return existing;
    }

    const role: AccessRole = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };

    this.roles.set(role.key, role);
    return role;
  }

  createUser(input: {
    username: string;
    displayName: string;
    roleKeys: string[];
  }) {
    const existing = this.users.get(input.username);

    if (existing) {
      return existing;
    }

    for (const roleKey of input.roleKeys) {
      if (!this.roles.has(roleKey)) {
        throw new Error(
          `Role not found: ${roleKey}`,
        );
      }
    }

    const user: IdentityUser = {
      id: randomUUID(),
      ...input,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.users.set(user.username, user);
    return user;
  }

  authorize(
    username: string,
    permission: string,
  ): AccessDecision {
    const user = this.getUser(username);

    if (user.status !== 'active') {
      return {
        allowed: false,
        userId: user.id,
        permission,
        reason: `User status is ${user.status}`,
        decidedAt: new Date().toISOString(),
      };
    }

    const permissions = user.roleKeys.flatMap(
      (roleKey) =>
        this.roles.get(roleKey)?.permissions ?? [],
    );

    const allowed =
      permissions.includes('*') ||
      permissions.includes(permission);

    return {
      allowed,
      userId: user.id,
      permission,
      reason: allowed
        ? 'Permission granted by role.'
        : 'Permission not granted.',
      decidedAt: new Date().toISOString(),
    };
  }

  disableUser(username: string) {
    const user = this.getUser(username);
    user.status = 'disabled';
    return user;
  }

  getUser(username: string) {
    const user = this.users.get(username);

    if (!user) {
      throw new Error(
        `User not found: ${username}`,
      );
    }

    return user;
  }

  listUsers() {
    return [...this.users.values()];
  }

  listRoles() {
    return [...this.roles.values()];
  }
}