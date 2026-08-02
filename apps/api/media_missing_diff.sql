-- CreateTable
CREATE TABLE "public"."media_audience_profiles" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "attributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_audience_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_competitors" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT,
    "analysis" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_opportunities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "score" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'awaiting_approval',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_research" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_research_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_trends" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "score" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'detected',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_trends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_audience_profiles_projectId_idx" ON "public"."media_audience_profiles"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_competitors_projectId_idx" ON "public"."media_competitors"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_opportunities_projectId_idx" ON "public"."media_opportunities"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_opportunities_status_idx" ON "public"."media_opportunities"("status" ASC);

-- CreateIndex
CREATE INDEX "media_research_projectId_idx" ON "public"."media_research"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_trends_projectId_idx" ON "public"."media_trends"("projectId" ASC);
