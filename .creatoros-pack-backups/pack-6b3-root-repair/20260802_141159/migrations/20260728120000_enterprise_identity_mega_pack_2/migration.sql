CREATE TYPE "CreatorSessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');
CREATE TYPE "CreatorCredentialStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

CREATE TABLE "CreatorUserProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "displayName" TEXT,
  "firstName" TEXT,
  "lastName" TEXT,
  "avatarUrl" TEXT,
  "locale" TEXT NOT NULL DEFAULT 'en-US',
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreatorUserProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CreatorSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sessionKey" TEXT NOT NULL,
  "status" "CreatorSessionStatus" NOT NULL DEFAULT 'ACTIVE',
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "deviceName" TEXT,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreatorSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CreatorApiKey" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "keyPrefix" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "status" "CreatorCredentialStatus" NOT NULL DEFAULT 'ACTIVE',
  "scopes" TEXT[],
  "lastUsedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreatorApiKey_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CreatorPersonalAccessToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "tokenPrefix" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "status" "CreatorCredentialStatus" NOT NULL DEFAULT 'ACTIVE',
  "scopes" TEXT[],
  "lastUsedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreatorPersonalAccessToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CreatorUserProfile_userId_key" ON "CreatorUserProfile"("userId");
CREATE UNIQUE INDEX "CreatorSession_sessionKey_key" ON "CreatorSession"("sessionKey");
CREATE INDEX "CreatorSession_userId_status_idx" ON "CreatorSession"("userId", "status");
CREATE INDEX "CreatorSession_expiresAt_idx" ON "CreatorSession"("expiresAt");
CREATE UNIQUE INDEX "CreatorApiKey_keyHash_key" ON "CreatorApiKey"("keyHash");
CREATE INDEX "CreatorApiKey_userId_status_idx" ON "CreatorApiKey"("userId", "status");
CREATE INDEX "CreatorApiKey_keyPrefix_idx" ON "CreatorApiKey"("keyPrefix");
CREATE UNIQUE INDEX "CreatorPersonalAccessToken_tokenHash_key" ON "CreatorPersonalAccessToken"("tokenHash");
CREATE INDEX "CreatorPersonalAccessToken_userId_status_idx" ON "CreatorPersonalAccessToken"("userId", "status");
CREATE INDEX "CreatorPersonalAccessToken_tokenPrefix_idx" ON "CreatorPersonalAccessToken"("tokenPrefix");

ALTER TABLE "CreatorUserProfile" ADD CONSTRAINT "CreatorUserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorSession" ADD CONSTRAINT "CreatorSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorApiKey" ADD CONSTRAINT "CreatorApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreatorPersonalAccessToken" ADD CONSTRAINT "CreatorPersonalAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;