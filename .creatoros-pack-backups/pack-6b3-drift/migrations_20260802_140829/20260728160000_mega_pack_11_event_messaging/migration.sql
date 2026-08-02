-- Mega Pack 11 — Event & Messaging Platform
CREATE TYPE "EventTopicStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED', 'DISABLED');
CREATE TYPE "EventSubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DISABLED');
CREATE TYPE "EventMessagePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');
CREATE TYPE "EventDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'RETRYING', 'DELIVERED', 'FAILED', 'DEAD_LETTER', 'CANCELLED');
CREATE TYPE "EventReplayStatus" AS ENUM ('PLANNED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

CREATE TABLE "EventTopic" (
  "id" TEXT NOT NULL,
  "topicKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "EventTopicStatus" NOT NULL DEFAULT 'ACTIVE',
  "partitions" INTEGER NOT NULL DEFAULT 1,
  "retentionDays" INTEGER NOT NULL DEFAULT 30,
  "ordered" BOOLEAN NOT NULL DEFAULT false,
  "schema" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventTopic_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventTopic_topicKey_key" ON "EventTopic"("topicKey");
CREATE INDEX "EventTopic_status_updatedAt_idx" ON "EventTopic"("status", "updatedAt");

CREATE TABLE "EventSubscription" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "subscriptionKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "consumerType" TEXT NOT NULL,
  "endpoint" TEXT,
  "status" "EventSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "maxAttempts" INTEGER NOT NULL DEFAULT 5,
  "retryDelaySeconds" INTEGER NOT NULL DEFAULT 60,
  "filter" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventSubscription_subscriptionKey_key" ON "EventSubscription"("subscriptionKey");
CREATE INDEX "EventSubscription_topicId_status_idx" ON "EventSubscription"("topicId", "status");

CREATE TABLE "EventMessage" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "eventName" TEXT NOT NULL,
  "eventVersion" TEXT NOT NULL,
  "producer" TEXT NOT NULL,
  "aggregateType" TEXT,
  "aggregateId" TEXT,
  "correlationId" TEXT,
  "causationId" TEXT,
  "idempotencyKey" TEXT,
  "priority" "EventMessagePriority" NOT NULL DEFAULT 'NORMAL',
  "payload" JSONB NOT NULL,
  "headers" JSONB NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventMessage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventMessage_idempotencyKey_key" ON "EventMessage"("idempotencyKey");
CREATE INDEX "EventMessage_topicId_occurredAt_idx" ON "EventMessage"("topicId", "occurredAt");
CREATE INDEX "EventMessage_eventName_occurredAt_idx" ON "EventMessage"("eventName", "occurredAt");
CREATE INDEX "EventMessage_correlationId_idx" ON "EventMessage"("correlationId");

CREATE TABLE "EventDelivery" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "subscriptionId" TEXT NOT NULL,
  "status" "EventDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "response" TEXT,
  "lastError" TEXT,
  "nextAttemptAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventDelivery_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventDelivery_messageId_subscriptionId_key" ON "EventDelivery"("messageId", "subscriptionId");
CREATE INDEX "EventDelivery_status_nextAttemptAt_idx" ON "EventDelivery"("status", "nextAttemptAt");
CREATE INDEX "EventDelivery_subscriptionId_status_idx" ON "EventDelivery"("subscriptionId", "status");

CREATE TABLE "EventDeadLetter" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  CONSTRAINT "EventDeadLetter_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventDeadLetter_deliveryId_key" ON "EventDeadLetter"("deliveryId");
CREATE INDEX "EventDeadLetter_resolvedAt_createdAt_idx" ON "EventDeadLetter"("resolvedAt", "createdAt");

CREATE TABLE "EventReplay" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "replayKey" TEXT NOT NULL,
  "fromMessageId" TEXT,
  "toMessageId" TEXT,
  "limit" INTEGER NOT NULL DEFAULT 1000,
  "status" "EventReplayStatus" NOT NULL DEFAULT 'PLANNED',
  "processedCount" INTEGER NOT NULL DEFAULT 0,
  "error" TEXT,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventReplay_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EventReplay_replayKey_key" ON "EventReplay"("replayKey");
CREATE INDEX "EventReplay_status_createdAt_idx" ON "EventReplay"("status", "createdAt");
CREATE INDEX "EventReplay_topicId_idx" ON "EventReplay"("topicId");

ALTER TABLE "EventSubscription" ADD CONSTRAINT "EventSubscription_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "EventTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventMessage" ADD CONSTRAINT "EventMessage_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "EventTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventDelivery" ADD CONSTRAINT "EventDelivery_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "EventMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventDelivery" ADD CONSTRAINT "EventDelivery_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "EventSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventDeadLetter" ADD CONSTRAINT "EventDeadLetter_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "EventDelivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventReplay" ADD CONSTRAINT "EventReplay_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "EventTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EventReplay" ADD CONSTRAINT "EventReplay_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "EventSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
