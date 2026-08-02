-- CreateEnum
CREATE TYPE "CreatorUserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateTable
CREATE TABLE "CreatorUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "status" "CreatorUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorRole" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorPermission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorUserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorUserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "CreatorRolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "CreatorRolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "CreatorRefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorOutboxEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "aggregateType" TEXT,
    "aggregateId" TEXT,
    "payload" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,

    CONSTRAINT "CreatorOutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorIdempotencyKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "statusCode" INTEGER,
    "response" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorIdempotencyKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorJobRun" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "details" JSONB,

    CONSTRAINT "CreatorJobRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorUser_username_key" ON "CreatorUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorUser_email_key" ON "CreatorUser"("email");

-- CreateIndex
CREATE INDEX "CreatorUser_status_idx" ON "CreatorUser"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorRole_key_key" ON "CreatorRole"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPermission_key_key" ON "CreatorPermission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorRefreshToken_tokenHash_key" ON "CreatorRefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "CreatorRefreshToken_userId_expiresAt_idx" ON "CreatorRefreshToken"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "CreatorOutboxEvent_publishedAt_occurredAt_idx" ON "CreatorOutboxEvent"("publishedAt", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorIdempotencyKey_key_key" ON "CreatorIdempotencyKey"("key");

-- CreateIndex
CREATE INDEX "CreatorIdempotencyKey_expiresAt_idx" ON "CreatorIdempotencyKey"("expiresAt");

-- CreateIndex
CREATE INDEX "CreatorJobRun_jobName_startedAt_idx" ON "CreatorJobRun"("jobName", "startedAt");

-- AddForeignKey
ALTER TABLE "CreatorUserRole" ADD CONSTRAINT "CreatorUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorUserRole" ADD CONSTRAINT "CreatorUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CreatorRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorRolePermission" ADD CONSTRAINT "CreatorRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CreatorRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorRolePermission" ADD CONSTRAINT "CreatorRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "CreatorPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorRefreshToken" ADD CONSTRAINT "CreatorRefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
