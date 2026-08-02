/*
  Warnings:

  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sponsor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorInteraction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorshipCampaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorshipOpportunity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorshipProposal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_audience_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_competitors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_opportunities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_research` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `media_trends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_sponsorId_fkey";

-- DropForeignKey
ALTER TABLE "SponsorInteraction" DROP CONSTRAINT "SponsorInteraction_sponsorId_fkey";

-- DropForeignKey
ALTER TABLE "SponsorshipCampaign" DROP CONSTRAINT "SponsorshipCampaign_sponsorId_fkey";

-- DropForeignKey
ALTER TABLE "SponsorshipOpportunity" DROP CONSTRAINT "SponsorshipOpportunity_sponsorId_fkey";

-- DropForeignKey
ALTER TABLE "SponsorshipProposal" DROP CONSTRAINT "SponsorshipProposal_sponsorId_fkey";

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "Sponsor";

-- DropTable
DROP TABLE "SponsorInteraction";

-- DropTable
DROP TABLE "SponsorshipCampaign";

-- DropTable
DROP TABLE "SponsorshipOpportunity";

-- DropTable
DROP TABLE "SponsorshipProposal";

-- DropTable
DROP TABLE "media_audience_profiles";

-- DropTable
DROP TABLE "media_competitors";

-- DropTable
DROP TABLE "media_opportunities";

-- DropTable
DROP TABLE "media_research";

-- DropTable
DROP TABLE "media_trends";

-- DropEnum
DROP TYPE "SponsorStatus";

-- DropEnum
DROP TYPE "SponsorshipType";

-- CreateTable
CREATE TABLE "MediaResearch" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "researchType" TEXT NOT NULL,
    "sourceMode" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "findings" TEXT[],
    "tags" TEXT[],
    "confidence" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaTrend" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "platform" TEXT NOT NULL,
    "market" TEXT,
    "language" TEXT,
    "growthScore" INTEGER NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "competitionScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'detected',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaCompetitor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "channelUrl" TEXT,
    "market" TEXT,
    "language" TEXT,
    "niche" TEXT,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "publishingNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaCompetitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAudienceProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "market" TEXT,
    "language" TEXT,
    "ageRange" TEXT,
    "interests" TEXT[],
    "painPoints" TEXT[],
    "searchIntents" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAudienceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaOpportunity" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "opportunityType" TEXT NOT NULL,
    "market" TEXT,
    "platform" TEXT,
    "demandScore" INTEGER NOT NULL,
    "competitionScore" INTEGER NOT NULL,
    "executionScore" INTEGER NOT NULL,
    "revenueScore" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "rationale" TEXT,
    "status" TEXT NOT NULL DEFAULT 'awaiting_approval',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionAuditEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "jobId" TEXT,
    "stepId" TEXT,
    "resultId" TEXT,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "status" "ExecutionStatus",
    "message" TEXT NOT NULL,
    "runtimeProviderId" TEXT,
    "actorType" TEXT,
    "actorId" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutionAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaResearch_projectId_idx" ON "MediaResearch"("projectId");

-- CreateIndex
CREATE INDEX "MediaResearch_researchType_idx" ON "MediaResearch"("researchType");

-- CreateIndex
CREATE INDEX "MediaResearch_status_idx" ON "MediaResearch"("status");

-- CreateIndex
CREATE INDEX "MediaResearch_createdAt_idx" ON "MediaResearch"("createdAt");

-- CreateIndex
CREATE INDEX "MediaTrend_projectId_idx" ON "MediaTrend"("projectId");

-- CreateIndex
CREATE INDEX "MediaTrend_platform_idx" ON "MediaTrend"("platform");

-- CreateIndex
CREATE INDEX "MediaTrend_status_idx" ON "MediaTrend"("status");

-- CreateIndex
CREATE INDEX "MediaTrend_detectedAt_idx" ON "MediaTrend"("detectedAt");

-- CreateIndex
CREATE INDEX "MediaCompetitor_projectId_idx" ON "MediaCompetitor"("projectId");

-- CreateIndex
CREATE INDEX "MediaCompetitor_platform_idx" ON "MediaCompetitor"("platform");

-- CreateIndex
CREATE INDEX "MediaCompetitor_status_idx" ON "MediaCompetitor"("status");

-- CreateIndex
CREATE INDEX "MediaAudienceProfile_projectId_idx" ON "MediaAudienceProfile"("projectId");

-- CreateIndex
CREATE INDEX "MediaAudienceProfile_market_idx" ON "MediaAudienceProfile"("market");

-- CreateIndex
CREATE INDEX "MediaAudienceProfile_language_idx" ON "MediaAudienceProfile"("language");

-- CreateIndex
CREATE INDEX "MediaAudienceProfile_status_idx" ON "MediaAudienceProfile"("status");

-- CreateIndex
CREATE INDEX "MediaOpportunity_projectId_idx" ON "MediaOpportunity"("projectId");

-- CreateIndex
CREATE INDEX "MediaOpportunity_opportunityType_idx" ON "MediaOpportunity"("opportunityType");

-- CreateIndex
CREATE INDEX "MediaOpportunity_status_idx" ON "MediaOpportunity"("status");

-- CreateIndex
CREATE INDEX "MediaOpportunity_totalScore_idx" ON "MediaOpportunity"("totalScore");

-- CreateIndex
CREATE INDEX "MediaOpportunity_createdAt_idx" ON "MediaOpportunity"("createdAt");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_sessionId_occurredAt_idx" ON "ExecutionAuditEvent"("sessionId", "occurredAt");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_jobId_idx" ON "ExecutionAuditEvent"("jobId");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_stepId_idx" ON "ExecutionAuditEvent"("stepId");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_resultId_idx" ON "ExecutionAuditEvent"("resultId");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_eventType_idx" ON "ExecutionAuditEvent"("eventType");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_severity_idx" ON "ExecutionAuditEvent"("severity");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_status_idx" ON "ExecutionAuditEvent"("status");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_runtimeProviderId_idx" ON "ExecutionAuditEvent"("runtimeProviderId");

-- CreateIndex
CREATE INDEX "ExecutionAuditEvent_occurredAt_idx" ON "ExecutionAuditEvent"("occurredAt");

-- AddForeignKey
ALTER TABLE "ExecutionAuditEvent" ADD CONSTRAINT "ExecutionAuditEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ExecutionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
