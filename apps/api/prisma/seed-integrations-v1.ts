import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  await prisma.integrationEndpoint.upsert({
    where: { endpointKey: 'creatoros-internal-event-bus' },
    update: { status: 'ACTIVE' },
    create: {
      endpointKey: 'creatoros-internal-event-bus',
      name: 'CreatorOS Internal Event Bus',
      type: 'EVENT_BUS',
      description: 'Canonical internal event and integration endpoint.',
      status: 'ACTIVE',
      configuration: {
        transport: 'database-outbox',
        delivery: 'at-least-once',
        idempotencyRequired: true,
        humanFinalAuthority: true,
      },
    },
  });

  await prisma.integrationEndpoint.upsert({
    where: { endpointKey: 'creatoros-api-gateway' },
    update: { status: 'ACTIVE' },
    create: {
      endpointKey: 'creatoros-api-gateway',
      name: 'CreatorOS API Gateway',
      type: 'API_GATEWAY',
      description: 'Governed gateway for internal and external CreatorOS APIs.',
      status: 'ACTIVE',
      configuration: {
        authentication: 'bearer',
        authorization: 'permission-based',
        auditEnabled: true,
        versioning: true,
      },
    },
  });

  const definitions = [
    {
      eventName: 'creator.content.published',
      domain: 'content',
      version: '1.0.0',
      description: 'Emitted when CreatorOS publishes content.',
      schema: { type: 'object', required: ['contentId'], properties: { contentId: { type: 'string' } } },
    },
    {
      eventName: 'creator.workflow.completed',
      domain: 'workflow',
      version: '1.0.0',
      description: 'Emitted when a governed workflow completes.',
      schema: { type: 'object', required: ['workflowId'], properties: { workflowId: { type: 'string' } } },
    },
    {
      eventName: 'creator.integration.delivery.failed',
      domain: 'integration',
      version: '1.0.0',
      description: 'Emitted when an integration delivery fails.',
      schema: { type: 'object', required: ['deliveryId'], properties: { deliveryId: { type: 'string' } } },
    },
  ];

  for (const definition of definitions) {
    await prisma.integrationEventDefinition.upsert({
      where: { eventName: definition.eventName },
      update: { active: true, version: definition.version, schema: definition.schema },
      create: { ...definition, active: true },
    });
  }

  await prisma.integrationWebhook.upsert({
    where: { webhookKey: 'creatoros-audit-webhook' },
    update: { active: false },
    create: {
      webhookKey: 'creatoros-audit-webhook',
      name: 'CreatorOS Audit Webhook',
      url: 'http://localhost:3000/internal/audit-hook',
      eventNames: ['creator.content.published', 'creator.workflow.completed'],
      active: false,
    },
  });

  await prisma.integrationSaga.upsert({
    where: { sagaKey: 'mega-pack-10-enterprise-integration-activation' },
    update: {},
    create: {
      sagaKey: 'mega-pack-10-enterprise-integration-activation',
      name: 'Activate Enterprise Integration Platform',
      correlationId: 'MP10-1.0.0',
      status: 'COMPLETED',
      state: {
        integrationRegistry: true,
        eventCatalog: true,
        webhooks: true,
        deliveryLifecycle: true,
        sagas: true,
        audit: true,
        humanFinalAuthority: true,
      },
      completedAt: new Date(),
    },
  });

  console.log('Mega Pack 10 Enterprise Integration seed completed.');
}

main().finally(async () => prisma.$disconnect());
