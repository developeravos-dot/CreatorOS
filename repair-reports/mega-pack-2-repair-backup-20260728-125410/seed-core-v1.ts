import { PrismaClient } from '../src/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const permissions = [
    'users.read',
    'users.write',
    'roles.read',
    'roles.write',
    'permissions.read',
    'permissions.write',
    'sessions.read',
    'sessions.write',
    'api-keys.read',
    'api-keys.write',
    'tokens.read',
    'tokens.write',
    'identity.dashboard.read',
    'system.admin',
  ];

  for (const key of permissions) {
    await prisma.creatorPermission.upsert({
      where: { key },
      update: {},
      create: {
        key,
        description: key,
      },
    });
  }

  const adminRole = await prisma.creatorRole.upsert({
    where: { key: 'admin' },
    update: {},
    create: {
      key: 'admin',
      name: 'Administrator',
    },
  });

  const allPermissions =
    await prisma.creatorPermission.findMany();

  for (const permission of allPermissions) {
    await prisma.creatorRolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  const username =
    process.env.CREATOROS_ADMIN_USERNAME ?? 'admin';

  const password =
    process.env.CREATOROS_ADMIN_PASSWORD ??
    'replace-this-password';

  const passwordHash = await hash(password, 12);

  const admin = await prisma.creatorUser.upsert({
    where: { username },
    update: {},
    create: {
      username,
      passwordHash,
    },
  });

  await prisma.creatorUserRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });