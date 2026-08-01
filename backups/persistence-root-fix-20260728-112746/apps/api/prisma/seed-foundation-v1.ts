import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/modules/persistence/generated/prisma/client';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not configured.');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

const items = [
  ['creatoros.core','platform','Core Platform'],
  ['creatoros.config','platform','Configuration Management'],
  ['creatoros.logging','observability','Centralized Logging'],
  ['creatoros.events','integration','Event Bus'],
  ['creatoros.knowledge','knowledge','Knowledge Foundation'],
  ['creatoros.workflow','automation','Workflow Foundation'],
  ['creatoros.messaging','integration','Messaging Foundation'],
  ['creatoros.runtime','platform','Runtime Mega Pack'],
  ['creatoros.blueprint','platform','Blueprint Engine Mega Pack'],
] as const;

async function main() {
  for (const [capabilityKey, domain, name] of items) {
    await prisma.capability.upsert({
      where: { capabilityKey },
      update: {
        domain,
        name,
        status: 'ACTIVE',
        contract: { version: '1.0.0' },
        dependencies: [],
        metadata: {
          seed: 'foundation-v1',
          foundationFirst: true,
          capabilityFirst: true,
          blueprintDriven: true,
          humanFinalAuthority: true,
        },
      },
      create: {
        capabilityKey,
        domain,
        name,
        status: 'ACTIVE',
        contract: { version: '1.0.0' },
        dependencies: [],
        metadata: {
          seed: 'foundation-v1',
          foundationFirst: true,
          capabilityFirst: true,
          blueprintDriven: true,
          humanFinalAuthority: true,
        },
      },
    });
  }

  const definition = {
    hierarchy: ['Constitution','Master Blueprint','Catalogs','Implementation'],
    capabilities: items.map(([key]) => key),
    principles: {
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    },
  };

  const blueprint = await prisma.blueprint.upsert({
    where: { blueprintKey: 'creatoros.master-blueprint' },
    update: {
      name: 'CreatorOS Master Blueprint',
      description: 'Authoritative architecture blueprint for CreatorOS / AVOS.',
      definition,
      metadata: {
        authority: 'Constitution',
        livingBlueprint: true,
        persistent: true,
      },
    },
    create: {
      blueprintKey: 'creatoros.master-blueprint',
      name: 'CreatorOS Master Blueprint',
      description: 'Authoritative architecture blueprint for CreatorOS / AVOS.',
      status: 'DRAFT',
      definition,
      metadata: {
        authority: 'Constitution',
        livingBlueprint: true,
        persistent: true,
      },
    },
  });

  await prisma.blueprintVersion.upsert({
    where: {
      blueprintId_version: { blueprintId: blueprint.id, version: 1 },
    },
    update: { definition, changeNote: 'Foundation Seed Pack 1' },
    create: {
      blueprintId: blueprint.id,
      version: 1,
      definition,
      changeNote: 'Foundation Seed Pack 1',
    },
  });

  for (const gateType of [
    'Architecture Approval',
    'Implementation Approval',
  ]) {
    const gate = await prisma.approvalGate.findFirst({
      where: { blueprintId: blueprint.id, gateType },
    });
    if (!gate) {
      await prisma.approvalGate.create({
        data: {
          blueprintId: blueprint.id,
          gateType,
          status: 'PENDING',
        },
      });
    }
  }

  console.log(JSON.stringify({
    success: true,
    capabilities: items.length,
    masterBlueprintId: blueprint.id,
  }, null, 2));
}

main().finally(() => prisma.$disconnect());