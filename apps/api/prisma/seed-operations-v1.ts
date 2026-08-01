import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const api = await prisma.opsService.upsert({
    where: { serviceKey: 'creatoros-api' },
    update: {},
    create: {
      serviceKey: 'creatoros-api',
      name: 'CreatorOS API',
      description: 'Primary CreatorOS NestJS application service.',
      owner: 'CreatorOS Platform Operations',
      status: 'OPERATIONAL',
      metadata: {
        seededBy: 'mega-pack-9',
        tier: 'critical',
      },
    },
  });

  await prisma.opsRunbook.upsert({
    where: { runbookKey: 'creatoros-api-recovery' },
    update: {},
    create: {
      runbookKey: 'creatoros-api-recovery',
      serviceId: api.id,
      title: 'CreatorOS API Recovery',
      content: [
        '1. Confirm database and dependency health.',
        '2. Review application logs and active incidents.',
        '3. Validate the latest deployment and migration state.',
        '4. Roll back only through an authorized operational change.',
        '5. Record the resolution and follow-up actions.',
      ].join('\n'),
      owner: 'CreatorOS Platform Operations',
      active: true,
    },
  });

  await prisma.opsSla.upsert({
    where: { serviceId: api.id },
    update: {},
    create: {
      serviceId: api.id,
      name: 'CreatorOS API Production SLA',
      targetAvailability: 99,
      responseMinutes: 15,
      resolutionMinutes: 240,
      active: true,
    },
  });

  await prisma.opsDeployment.upsert({
    where: {
      id: 'mega-pack-9-baseline-deployment',
    },
    update: {},
    create: {
      id: 'mega-pack-9-baseline-deployment',
      serviceId: api.id,
      version: 'MP9-1.0.0',
      environment: 'production',
      status: 'SUCCEEDED',
      initiatedBy: 'CreatorOS Mega Pack 9',
      completedAt: new Date(),
      notes: 'Enterprise Operations baseline activated.',
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
