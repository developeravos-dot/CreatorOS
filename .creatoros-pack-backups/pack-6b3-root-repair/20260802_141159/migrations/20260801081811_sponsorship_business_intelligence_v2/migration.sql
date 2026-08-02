-- CreateTable
CREATE TABLE "media_projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "primaryLanguage" TEXT NOT NULL,
    "targetMarkets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_channel_families" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rootChannelId" TEXT NOT NULL,
    "channelIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_channel_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_channels" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "parentChannelId" TEXT,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "market" TEXT,
    "niche" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_content_ideas" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "channelFamilyId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "sourceMode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'awaiting_approval',
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_content_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_human_approvals" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_human_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_domain_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "payload" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_domain_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_channel_families_projectId_idx" ON "media_channel_families"("projectId");

-- CreateIndex
CREATE INDEX "media_channels_projectId_idx" ON "media_channels"("projectId");

-- CreateIndex
CREATE INDEX "media_channels_familyId_idx" ON "media_channels"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "media_channels_familyId_language_key" ON "media_channels"("familyId", "language");

-- CreateIndex
CREATE INDEX "media_content_ideas_projectId_idx" ON "media_content_ideas"("projectId");

-- CreateIndex
CREATE INDEX "media_content_ideas_channelFamilyId_idx" ON "media_content_ideas"("channelFamilyId");

-- CreateIndex
CREATE INDEX "media_human_approvals_entityType_entityId_idx" ON "media_human_approvals"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "media_human_approvals_status_idx" ON "media_human_approvals"("status");

-- CreateIndex
CREATE INDEX "media_domain_events_eventType_idx" ON "media_domain_events"("eventType");

-- CreateIndex
CREATE INDEX "media_domain_events_entityType_entityId_idx" ON "media_domain_events"("entityType", "entityId");
