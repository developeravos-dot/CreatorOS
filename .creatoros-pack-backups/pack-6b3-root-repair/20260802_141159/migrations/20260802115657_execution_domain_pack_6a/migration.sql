CREATE TABLE "ExecutionSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "projectId" TEXT,
    "sessionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "requiresHumanApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "metadata" JSONB,
    "context" JSONB,
    "finalOutput" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionSession_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "ExecutionJob" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "jobKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assignedAgentId" TEXT,
    "runtimeProviderId" TEXT,
    "capability" TEXT,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "sequence" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "input" JSONB,
    "output" JSONB,
    "metadata" JSONB,
    "errorMessage" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionJob_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "ExecutionStep" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "runtimeProviderId" TEXT,
    "operation" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "input" JSONB,
    "output" JSONB,
    "metadata" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionStep_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "ExecutionResult" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "resultType" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "output" JSONB,
    "logs" JSONB,
    "metrics" JSONB,
    "artifacts" JSONB,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutionResult_pkey"
        PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX
    "ExecutionSession_sessionKey_key"
ON "ExecutionSession"("sessionKey");

CREATE INDEX
    "ExecutionSession_workspaceId_idx"
ON "ExecutionSession"("workspaceId");

CREATE INDEX
    "ExecutionSession_projectId_idx"
ON "ExecutionSession"("projectId");

CREATE INDEX
    "ExecutionSession_status_idx"
ON "ExecutionSession"("status");

CREATE INDEX
    "ExecutionSession_createdAt_idx"
ON "ExecutionSession"("createdAt");

CREATE INDEX
    "ExecutionSession_updatedAt_idx"
ON "ExecutionSession"("updatedAt");

CREATE UNIQUE INDEX
    "ExecutionJob_sessionId_jobKey_key"
ON "ExecutionJob"("sessionId", "jobKey");

CREATE INDEX
    "ExecutionJob_sessionId_idx"
ON "ExecutionJob"("sessionId");

CREATE INDEX
    "ExecutionJob_assignedAgentId_idx"
ON "ExecutionJob"("assignedAgentId");

CREATE INDEX
    "ExecutionJob_runtimeProviderId_idx"
ON "ExecutionJob"("runtimeProviderId");

CREATE INDEX
    "ExecutionJob_capability_idx"
ON "ExecutionJob"("capability");

CREATE INDEX
    "ExecutionJob_status_idx"
ON "ExecutionJob"("status");

CREATE INDEX
    "ExecutionJob_priority_idx"
ON "ExecutionJob"("priority");

CREATE INDEX
    "ExecutionJob_sequence_idx"
ON "ExecutionJob"("sequence");

CREATE UNIQUE INDEX
    "ExecutionStep_jobId_stepKey_key"
ON "ExecutionStep"("jobId", "stepKey");

CREATE INDEX
    "ExecutionStep_jobId_idx"
ON "ExecutionStep"("jobId");

CREATE INDEX
    "ExecutionStep_runtimeProviderId_idx"
ON "ExecutionStep"("runtimeProviderId");

CREATE INDEX
    "ExecutionStep_status_idx"
ON "ExecutionStep"("status");

CREATE INDEX
    "ExecutionStep_sequence_idx"
ON "ExecutionStep"("sequence");

CREATE INDEX
    "ExecutionResult_stepId_idx"
ON "ExecutionResult"("stepId");

CREATE INDEX
    "ExecutionResult_resultType_idx"
ON "ExecutionResult"("resultType");

CREATE INDEX
    "ExecutionResult_success_idx"
ON "ExecutionResult"("success");

CREATE INDEX
    "ExecutionResult_createdAt_idx"
ON "ExecutionResult"("createdAt");

ALTER TABLE "ExecutionSession"
ADD CONSTRAINT "ExecutionSession_workspaceId_fkey"
FOREIGN KEY ("workspaceId")
REFERENCES "AiOrganizationWorkspaceState"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ExecutionJob"
ADD CONSTRAINT "ExecutionJob_sessionId_fkey"
FOREIGN KEY ("sessionId")
REFERENCES "ExecutionSession"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ExecutionStep"
ADD CONSTRAINT "ExecutionStep_jobId_fkey"
FOREIGN KEY ("jobId")
REFERENCES "ExecutionJob"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ExecutionResult"
ADD CONSTRAINT "ExecutionResult_stepId_fkey"
FOREIGN KEY ("stepId")
REFERENCES "ExecutionStep"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;