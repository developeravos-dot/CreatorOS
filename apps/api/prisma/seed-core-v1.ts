import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

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
    'governance.read',
    'governance.write',
    'governance.approve',
    'governance.dashboard.read',
    'risk.read',
    'risk.write',
    'compliance.read',
    'compliance.write',
    'change.read',
    'change.write',
    'change.approve',
    'system.admin',
  ];

  for (const key of permissions) {
    await prisma.creatorPermission.upsert({
      where: { key },
      update: { description: key },
      create: {
        key,
        description: key,
      },
    });
  }

  const adminRole = await prisma.creatorRole.upsert({
    where: { key: 'admin' },
    update: {
      name: 'Administrator',
      description: 'CreatorOS system administrator role.',
    },
    create: {
      key: 'admin',
      name: 'Administrator',
      description: 'CreatorOS system administrator role.',
    },
  });

  const allPermissions = await prisma.creatorPermission.findMany({
    select: { id: true },
  });

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

  const username = process.env.CREATOROS_ADMIN_USERNAME ?? 'admin';
  const password =
    process.env.CREATOROS_ADMIN_PASSWORD ?? 'replace-this-password';
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

  await prisma.creatorUserProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      displayName: 'CreatorOS Administrator',
    },
  });

  await prisma.governancePolicy.upsert({
    where: { policyKey: 'engineering.zero-temporary-fixes' },
    update: {},
    create: { policyKey: 'engineering.zero-temporary-fixes', name: 'Zero Temporary Fixes', category: 'engineering', status: 'ACTIVE', version: 1, rules: { principle: 'root-cause-first', temporaryFixesAllowed: false }, owner: 'Engineering Governance OS', effectiveAt: new Date() },
  });
  await prisma.governanceComplianceRule.upsert({
    where: { ruleKey: 'release.typecheck-build-required' },
    update: {},
    create: { ruleKey: 'release.typecheck-build-required', name: 'Typecheck and build required', framework: 'CreatorOS Engineering Governance', control: 'RELEASE-GATE-001', severity: 'HIGH', evidence: { required: ['typecheck', 'build'] } },
  });
  await prisma.governanceRisk.upsert({
    where: { riskKey: 'platform.uncontrolled-complexity' },
    update: {},
    create: { riskKey: 'platform.uncontrolled-complexity', title: 'Uncontrolled platform complexity', description: 'Complexity growth without an explicit budget.', category: 'architecture', likelihood: 3, impact: 5, score: 15, level: 'HIGH', mitigationPlan: 'Apply complexity budgets, delete-first review, and architecture approval gates.', owner: 'Engineering Governance OS' },
  });

  console.log('CreatorOS Enterprise Identity and Governance seed completed.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });