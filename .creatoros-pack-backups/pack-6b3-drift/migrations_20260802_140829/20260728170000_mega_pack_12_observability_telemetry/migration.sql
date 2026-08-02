DO $$ BEGIN
  CREATE TYPE "ObsMetricKind" AS ENUM ('COUNTER','GAUGE','HISTOGRAM');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "ObsHealthStatus" AS ENUM ('HEALTHY','DEGRADED','DOWN','UNKNOWN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "ObsLogLevel" AS ENUM ('TRACE','DEBUG','INFO','WARN','ERROR','FATAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "ObsAlertSeverity" AS ENUM ('INFO','WARNING','HIGH','CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "ObsAlertStatus" AS ENUM ('OPEN','ACKNOWLEDGED','RESOLVED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "ObsMetric" (
  "id" TEXT NOT NULL,
  "metricKey" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "kind" "ObsMetricKind" NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "unit" TEXT,
  "labels" JSONB NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ObsMetric_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ObsMetric_metricKey_observedAt_idx" ON "ObsMetric"("metricKey","observedAt");
CREATE INDEX IF NOT EXISTS "ObsMetric_service_observedAt_idx" ON "ObsMetric"("service","observedAt");

CREATE TABLE IF NOT EXISTS "ObsHealthCheck" (
  "id" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "status" "ObsHealthStatus" NOT NULL DEFAULT 'UNKNOWN',
  "latencyMs" DOUBLE PRECISION,
  "message" TEXT,
  "details" JSONB NOT NULL,
  "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ObsHealthCheck_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ObsHealthCheck_service_checkedAt_idx" ON "ObsHealthCheck"("service","checkedAt");
CREATE INDEX IF NOT EXISTS "ObsHealthCheck_status_checkedAt_idx" ON "ObsHealthCheck"("status","checkedAt");

CREATE TABLE IF NOT EXISTS "ObsLogEntry" (
  "id" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "level" "ObsLogLevel" NOT NULL,
  "message" TEXT NOT NULL,
  "traceId" TEXT,
  "spanId" TEXT,
  "context" JSONB NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ObsLogEntry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ObsLogEntry_service_occurredAt_idx" ON "ObsLogEntry"("service","occurredAt");
CREATE INDEX IF NOT EXISTS "ObsLogEntry_level_occurredAt_idx" ON "ObsLogEntry"("level","occurredAt");
CREATE INDEX IF NOT EXISTS "ObsLogEntry_traceId_idx" ON "ObsLogEntry"("traceId");

CREATE TABLE IF NOT EXISTS "ObsTraceSpan" (
  "id" TEXT NOT NULL,
  "traceId" TEXT NOT NULL,
  "spanId" TEXT NOT NULL,
  "parentSpanId" TEXT,
  "service" TEXT NOT NULL,
  "operation" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "durationMs" DOUBLE PRECISION,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  "attributes" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ObsTraceSpan_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ObsTraceSpan_spanId_key" ON "ObsTraceSpan"("spanId");
CREATE INDEX IF NOT EXISTS "ObsTraceSpan_traceId_startedAt_idx" ON "ObsTraceSpan"("traceId","startedAt");
CREATE INDEX IF NOT EXISTS "ObsTraceSpan_service_startedAt_idx" ON "ObsTraceSpan"("service","startedAt");

CREATE TABLE IF NOT EXISTS "ObsAlertRule" (
  "id" TEXT NOT NULL,
  "ruleKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "metricKey" TEXT NOT NULL,
  "operator" TEXT NOT NULL,
  "threshold" DOUBLE PRECISION NOT NULL,
  "severity" "ObsAlertSeverity" NOT NULL,
  "evaluationWindowMinutes" INTEGER NOT NULL DEFAULT 5,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "labels" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ObsAlertRule_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ObsAlertRule_ruleKey_key" ON "ObsAlertRule"("ruleKey");
CREATE INDEX IF NOT EXISTS "ObsAlertRule_enabled_severity_idx" ON "ObsAlertRule"("enabled","severity");
CREATE INDEX IF NOT EXISTS "ObsAlertRule_metricKey_idx" ON "ObsAlertRule"("metricKey");

CREATE TABLE IF NOT EXISTS "ObsAlertEvent" (
  "id" TEXT NOT NULL,
  "ruleId" TEXT,
  "fingerprint" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" "ObsAlertSeverity" NOT NULL,
  "status" "ObsAlertStatus" NOT NULL DEFAULT 'OPEN',
  "service" TEXT,
  "currentValue" DOUBLE PRECISION,
  "note" TEXT,
  "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ObsAlertEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ObsAlertEvent_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "ObsAlertRule"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ObsAlertEvent_fingerprint_key" ON "ObsAlertEvent"("fingerprint");
CREATE INDEX IF NOT EXISTS "ObsAlertEvent_status_severity_idx" ON "ObsAlertEvent"("status","severity");
CREATE INDEX IF NOT EXISTS "ObsAlertEvent_service_triggeredAt_idx" ON "ObsAlertEvent"("service","triggeredAt");
CREATE INDEX IF NOT EXISTS "ObsAlertEvent_ruleId_idx" ON "ObsAlertEvent"("ruleId");
