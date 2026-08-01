import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  const topic = await prisma.eventTopic.upsert({
    where: { topicKey: 'creatoros.platform.events' },
    update: { status: 'ACTIVE', name: 'CreatorOS Platform Events' },
    create: {
      topicKey: 'creatoros.platform.events',
      name: 'CreatorOS Platform Events',
      description: 'Authoritative topic for CreatorOS platform lifecycle and enterprise domain events.',
      status: 'ACTIVE',
      partitions: 3,
      retentionDays: 90,
      ordered: true,
      schema: { type: 'object', required: ['eventName', 'eventVersion', 'payload'] },
    },
  });

  const subscription = await prisma.eventSubscription.upsert({
    where: { subscriptionKey: 'creatoros.audit.consumer' },
    update: { status: 'ACTIVE', topicId: topic.id },
    create: {
      topicId: topic.id,
      subscriptionKey: 'creatoros.audit.consumer',
      name: 'CreatorOS Audit Consumer',
      consumerType: 'INTERNAL_SERVICE',
      endpoint: 'internal://audit-log',
      status: 'ACTIVE',
      maxAttempts: 5,
      retryDelaySeconds: 60,
      filter: {},
    },
  });

  const message = await prisma.eventMessage.upsert({
    where: { idempotencyKey: 'mega-pack-11-baseline-event' },
    update: {},
    create: {
      topicId: topic.id,
      eventName: 'event-messaging.platform.activated',
      eventVersion: '1.0.0',
      producer: 'mega-pack-11-seed',
      aggregateType: 'CreatorOSPlatform',
      aggregateId: 'creatoros',
      idempotencyKey: 'mega-pack-11-baseline-event',
      priority: 'HIGH',
      payload: { megaPack: 11, platform: 'Event & Messaging', status: 'operational' },
      headers: { source: 'seed', humanFinalAuthority: true },
    },
  });

  await prisma.eventDelivery.upsert({
    where: { messageId_subscriptionId: { messageId: message.id, subscriptionId: subscription.id } },
    update: {},
    create: { messageId: message.id, subscriptionId: subscription.id, status: 'PENDING' },
  });

  console.log('Mega Pack 11 Event & Messaging Platform seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
