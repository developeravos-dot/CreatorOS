import { PrismaService } from '../../persistence/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly persistence: PrismaService) {}

  private credential(prefix: string) {
    const secret = randomBytes(32).toString('base64url');
    const value = `${prefix}_${secret}`;
    return {
      value,
      prefix: value.slice(0, 16),
      hash: createHash('sha256').update(value).digest('hex'),
    };
  }

  private async assertUser(userId: string) {
    const user = await this.persistence.creatorUser.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  private audit(action: string, resourceType: string, resourceId?: string, payload?: object) {
    return this.persistence.auditLog.create({
      data: {
        eventType: `identity.${action}`,
        actorType: 'SYSTEM',
        resourceType,
        resourceId,
        action,
        payload: payload ?? undefined,
      },
    });
  }

  async createUser(input: CreateUserDto) {
    const exists = await this.persistence.creatorUser.findFirst({
      where: { OR: [{ username: input.username }, ...(input.email ? [{ email: input.email }] : [])] },
    });
    if (exists) throw new ConflictException('Username or email already exists.');

    const user = await this.persistence.creatorUser.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash: await hash(input.password, 12),
        profile: { create: {} },
      },
      select: { id: true, username: true, email: true, status: true, createdAt: true },
    });
    await this.audit('user.created', 'CreatorUser', user.id, { username: user.username });
    return user;
  }

  listUsers() {
    return this.persistence.creatorUser.findMany({
      select: {
        id: true, username: true, email: true, status: true, createdAt: true, updatedAt: true,
        profile: true,
        roles: { select: { assignedAt: true, role: { select: { key: true, name: true } } } },
        _count: { select: { sessions: true, apiKeys: true, personalAccessTokens: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUser(userId: string) {
    const user = await this.persistence.creatorUser.findUnique({
      where: { id: userId },
      select: {
        id: true, username: true, email: true, status: true, createdAt: true, updatedAt: true,
        profile: true,
        roles: { select: { assignedAt: true, role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async updateUser(userId: string, input: UpdateUserDto) {
    await this.assertUser(userId);
    try {
      const user = await this.persistence.creatorUser.update({
        where: { id: userId },
        data: input,
        select: { id: true, username: true, email: true, status: true, updatedAt: true },
      });
      await this.audit('user.updated', 'CreatorUser', userId, input);
      return user;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Username or email already exists.');
      throw error;
    }
  }

  async disableUser(userId: string) {
    await this.assertUser(userId);
    const user = await this.persistence.$transaction(async (tx) => {
      const updated = await tx.creatorUser.update({ where: { id: userId }, data: { status: 'DISABLED' } });
      await tx.creatorSession.updateMany({ where: { userId, status: 'ACTIVE' }, data: { status: 'REVOKED', revokedAt: new Date() } });
      await tx.creatorApiKey.updateMany({ where: { userId, status: 'ACTIVE' }, data: { status: 'REVOKED', revokedAt: new Date() } });
      await tx.creatorPersonalAccessToken.updateMany({ where: { userId, status: 'ACTIVE' }, data: { status: 'REVOKED', revokedAt: new Date() } });
      return updated;
    });
    await this.audit('user.disabled', 'CreatorUser', userId);
    return { id: user.id, status: user.status };
  }

  async upsertProfile(userId: string, input: UpdateProfileDto) {
    await this.assertUser(userId);
    const profile = await this.persistence.creatorUserProfile.upsert({
      where: { userId }, update: input, create: { userId, ...input },
    });
    await this.audit('profile.updated', 'CreatorUserProfile', profile.id, { userId });
    return profile;
  }

  async assignRole(userId: string, roleKey: string) {
    await this.assertUser(userId);
    const role = await this.persistence.creatorRole.findUnique({ where: { key: roleKey } });
    if (!role) throw new NotFoundException('Role not found.');
    const assignment = await this.persistence.creatorUserRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } }, update: {}, create: { userId, roleId: role.id },
    });
    await this.audit('role.assigned', 'CreatorUser', userId, { roleKey });
    return assignment;
  }

  async removeRole(userId: string, roleKey: string) {
    await this.assertUser(userId);
    const role = await this.persistence.creatorRole.findUnique({ where: { key: roleKey } });
    if (!role) throw new NotFoundException('Role not found.');
    await this.persistence.creatorUserRole.deleteMany({ where: { userId, roleId: role.id } });
    await this.audit('role.removed', 'CreatorUser', userId, { roleKey });
    return { removed: true };
  }

  listRoles() {
    return this.persistence.creatorRole.findMany({
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
      orderBy: { key: 'asc' },
    });
  }

  async createRole(input: CreateRoleDto) {
    const permissions = input.permissionKeys?.length
      ? await this.persistence.creatorPermission.findMany({ where: { key: { in: input.permissionKeys } } })
      : [];
    if (input.permissionKeys && permissions.length !== input.permissionKeys.length) throw new NotFoundException('One or more permissions were not found.');
    try {
      const role = await this.persistence.creatorRole.create({
        data: {
          key: input.key, name: input.name, description: input.description,
          permissions: { create: permissions.map((permission) => ({ permissionId: permission.id })) },
        },
        include: { permissions: { include: { permission: true } } },
      });
      await this.audit('role.created', 'CreatorRole', role.id, { key: role.key });
      return role;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Role key already exists.');
      throw error;
    }
  }

  async updateRole(roleKey: string, input: UpdateRoleDto) {
    const role = await this.persistence.creatorRole.findUnique({ where: { key: roleKey } });
    if (!role) throw new NotFoundException('Role not found.');
    if (input.permissionKeys) {
      const permissions = await this.persistence.creatorPermission.findMany({ where: { key: { in: input.permissionKeys } } });
      if (permissions.length !== input.permissionKeys.length) throw new NotFoundException('One or more permissions were not found.');
      await this.persistence.$transaction(async (tx) => {
        await tx.creatorRolePermission.deleteMany({ where: { roleId: role.id } });
        if (permissions.length) await tx.creatorRolePermission.createMany({ data: permissions.map((p) => ({ roleId: role.id, permissionId: p.id })) });
      });
    }
    const updated = await this.persistence.creatorRole.update({
      where: { id: role.id }, data: { name: input.name, description: input.description },
      include: { permissions: { include: { permission: true } } },
    });
    await this.audit('role.updated', 'CreatorRole', role.id, { key: role.key });
    return updated;
  }

  listPermissions() {
    return this.persistence.creatorPermission.findMany({ orderBy: { key: 'asc' } });
  }

  async createPermission(input: CreatePermissionDto) {
    try {
      const permission = await this.persistence.creatorPermission.create({ data: input });
      await this.audit('permission.created', 'CreatorPermission', permission.id, { key: permission.key });
      return permission;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Permission key already exists.');
      throw error;
    }
  }

  async createSession(userId: string, input: CreateSessionDto) {
    await this.assertUser(userId);
    const session = this.credential('sess');
    const row = await this.persistence.creatorSession.create({
      data: { userId, sessionKey: session.hash, expiresAt: new Date(input.expiresAt), ipAddress: input.ipAddress, userAgent: input.userAgent, deviceName: input.deviceName },
    });
    await this.audit('session.created', 'CreatorSession', row.id, { userId });
    return { ...row, sessionToken: session.value, sessionKey: undefined };
  }

  async listSessions(userId: string) {
    await this.assertUser(userId);
    return this.persistence.creatorSession.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async revokeSession(userId: string, sessionId: string) {
    await this.assertUser(userId);
    const result = await this.persistence.creatorSession.updateMany({ where: { id: sessionId, userId }, data: { status: 'REVOKED', revokedAt: new Date() } });
    if (!result.count) throw new NotFoundException('Session not found.');
    await this.audit('session.revoked', 'CreatorSession', sessionId, { userId });
    return { revoked: true };
  }

  async createApiKey(userId: string, input: CreateCredentialDto) {
    await this.assertUser(userId);
    const key = this.credential('cosk');
    const row = await this.persistence.creatorApiKey.create({
      data: { userId, name: input.name, scopes: input.scopes, expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined, keyPrefix: key.prefix, keyHash: key.hash },
    });
    await this.audit('api-key.created', 'CreatorApiKey', row.id, { userId, name: row.name });
    return { ...row, secret: key.value, keyHash: undefined };
  }

  async listApiKeys(userId: string) {
    await this.assertUser(userId);
    return this.persistence.creatorApiKey.findMany({ where: { userId }, select: { id: true, name: true, keyPrefix: true, status: true, scopes: true, lastUsedAt: true, expiresAt: true, revokedAt: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  }

  async revokeApiKey(userId: string, keyId: string) {
    await this.assertUser(userId);
    const result = await this.persistence.creatorApiKey.updateMany({ where: { id: keyId, userId }, data: { status: 'REVOKED', revokedAt: new Date() } });
    if (!result.count) throw new NotFoundException('API key not found.');
    await this.audit('api-key.revoked', 'CreatorApiKey', keyId, { userId });
    return { revoked: true };
  }

  async createPersonalAccessToken(userId: string, input: CreateCredentialDto) {
    await this.assertUser(userId);
    const token = this.credential('cospat');
    const row = await this.persistence.creatorPersonalAccessToken.create({
      data: { userId, name: input.name, scopes: input.scopes, expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined, tokenPrefix: token.prefix, tokenHash: token.hash },
    });
    await this.audit('pat.created', 'CreatorPersonalAccessToken', row.id, { userId, name: row.name });
    return { ...row, token: token.value, tokenHash: undefined };
  }

  async listPersonalAccessTokens(userId: string) {
    await this.assertUser(userId);
    return this.persistence.creatorPersonalAccessToken.findMany({ where: { userId }, select: { id: true, name: true, tokenPrefix: true, status: true, scopes: true, lastUsedAt: true, expiresAt: true, revokedAt: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  }

  async revokePersonalAccessToken(userId: string, tokenId: string) {
    await this.assertUser(userId);
    const result = await this.persistence.creatorPersonalAccessToken.updateMany({ where: { id: tokenId, userId }, data: { status: 'REVOKED', revokedAt: new Date() } });
    if (!result.count) throw new NotFoundException('Personal access token not found.');
    await this.audit('pat.revoked', 'CreatorPersonalAccessToken', tokenId, { userId });
    return { revoked: true };
  }

  async dashboard() {
    const [users, activeUsers, roles, permissions, sessions, apiKeys, personalAccessTokens] = await Promise.all([
      this.persistence.creatorUser.count(),
      this.persistence.creatorUser.count({ where: { status: 'ACTIVE' } }),
      this.persistence.creatorRole.count(),
      this.persistence.creatorPermission.count(),
      this.persistence.creatorSession.count({ where: { status: 'ACTIVE', expiresAt: { gt: new Date() } } }),
      this.persistence.creatorApiKey.count({ where: { status: 'ACTIVE' } }),
      this.persistence.creatorPersonalAccessToken.count({ where: { status: 'ACTIVE' } }),
    ]);
    return { users, activeUsers, roles, permissions, activeSessions: sessions, activeApiKeys: apiKeys, activePersonalAccessTokens: personalAccessTokens };
  }
}