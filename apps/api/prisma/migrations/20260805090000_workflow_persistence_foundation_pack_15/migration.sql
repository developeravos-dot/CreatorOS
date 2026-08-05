CREATE TABLE "WorkflowExecutionPersistence" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "maxParallelSteps" INTEGER NOT NULL DEFAULT 1,
    "context" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "activeStepIds" TEXT[],
    "failureReason" TEXT,
    "startedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "WorkflowExecutionPersistence_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "WorkflowCheckpointPersistence" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "completedStepIds" TEXT[],
    "activeStepIds" TEXT[],
    "checksum" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowCheckpointPersistence_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "WorkflowStepStatePersistence" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "maxParallelSteps" INTEGER NOT NULL DEFAULT 1,
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "WorkflowStepStatePersistence_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "WorkflowEventPersistence" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowEventPersistence_pkey"
        PRIMARY KEY ("id")
);

CREATE TABLE "WorkflowRecoveryPersistence" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "checkpointId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "maxParallelSteps" INTEGER NOT NULL DEFAULT 1,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT NOT NULL,
    "restoredStepIds" TEXT[],
    "errorMessage" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "WorkflowRecoveryPersistence_pkey"
        PRIMARY KEY ("id")
);

CREATE INDEX
    "WorkflowExecutionPersistence_workflowId_idx"
ON "WorkflowExecutionPersistence"("workflowId");

CREATE INDEX
    "WorkflowExecutionPersistence_status_idx"
ON "WorkflowExecutionPersistence"("status");

CREATE INDEX
    "WorkflowExecutionPersistence_createdAt_idx"
ON "WorkflowExecutionPersistence"("createdAt");

CREATE INDEX
    "WorkflowExecutionPersistence_updatedAt_idx"
ON "WorkflowExecutionPersistence"("updatedAt");

CREATE UNIQUE INDEX
    "WorkflowCheckpointPersistence_executionId_sequence_key"
ON "WorkflowCheckpointPersistence"("executionId", "sequence");

CREATE INDEX
    "WorkflowCheckpointPersistence_executionId_idx"
ON "WorkflowCheckpointPersistence"("executionId");

CREATE INDEX
    "WorkflowCheckpointPersistence_createdAt_idx"
ON "WorkflowCheckpointPersistence"("createdAt");

CREATE UNIQUE INDEX
    "WorkflowStepStatePersistence_executionId_stepId_key"
ON "WorkflowStepStatePersistence"("executionId", "stepId");

CREATE INDEX
    "WorkflowStepStatePersistence_executionId_idx"
ON "WorkflowStepStatePersistence"("executionId");

CREATE INDEX
    "WorkflowStepStatePersistence_status_idx"
ON "WorkflowStepStatePersistence"("status");

CREATE INDEX
    "WorkflowStepStatePersistence_updatedAt_idx"
ON "WorkflowStepStatePersistence"("updatedAt");

CREATE UNIQUE INDEX
    "WorkflowEventPersistence_executionId_sequence_key"
ON "WorkflowEventPersistence"("executionId", "sequence");

CREATE INDEX
    "WorkflowEventPersistence_executionId_idx"
ON "WorkflowEventPersistence"("executionId");

CREATE INDEX
    "WorkflowEventPersistence_type_idx"
ON "WorkflowEventPersistence"("type");

CREATE INDEX
    "WorkflowEventPersistence_occurredAt_idx"
ON "WorkflowEventPersistence"("occurredAt");

CREATE INDEX
    "WorkflowRecoveryPersistence_executionId_idx"
ON "WorkflowRecoveryPersistence"("executionId");

CREATE INDEX
    "WorkflowRecoveryPersistence_checkpointId_idx"
ON "WorkflowRecoveryPersistence"("checkpointId");

CREATE INDEX
    "WorkflowRecoveryPersistence_status_idx"
ON "WorkflowRecoveryPersistence"("status");

CREATE INDEX
    "WorkflowRecoveryPersistence_requestedAt_idx"
ON "WorkflowRecoveryPersistence"("requestedAt");

ALTER TABLE "WorkflowCheckpointPersistence"
ADD CONSTRAINT "WorkflowCheckpointPersistence_executionId_fkey"
FOREIGN KEY ("executionId")
REFERENCES "WorkflowExecutionPersistence"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "WorkflowStepStatePersistence"
ADD CONSTRAINT "WorkflowStepStatePersistence_executionId_fkey"
FOREIGN KEY ("executionId")
REFERENCES "WorkflowExecutionPersistence"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "WorkflowEventPersistence"
ADD CONSTRAINT "WorkflowEventPersistence_executionId_fkey"
FOREIGN KEY ("executionId")
REFERENCES "WorkflowExecutionPersistence"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "WorkflowRecoveryPersistence"
ADD CONSTRAINT "WorkflowRecoveryPersistence_executionId_fkey"
FOREIGN KEY ("executionId")
REFERENCES "WorkflowExecutionPersistence"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "WorkflowRecoveryPersistence"
ADD CONSTRAINT "WorkflowRecoveryPersistence_checkpointId_fkey"
FOREIGN KEY ("checkpointId")
REFERENCES "WorkflowCheckpointPersistence"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
