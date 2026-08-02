-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."AgentDecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "public"."AgentMissionPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."AgentMissionStatus" AS ENUM ('DRAFT', 'QUEUED', 'RUNNING', 'BLOCKED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."AgentTeamStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."CreatorCredentialStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."CreatorSessionStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."CreatorUserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."EventDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'RETRYING', 'DELIVERED', 'FAILED', 'DEAD_LETTER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EventMessagePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."EventReplayStatus" AS ENUM ('PLANNED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EventSubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."EventTopicStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."GovernanceChangeStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."GovernanceComplianceStatus" AS ENUM ('NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'EXEMPTED');

-- CreateEnum
CREATE TYPE "public"."GovernanceDecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "public"."GovernancePolicyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."GovernanceRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."GovernanceRiskStatus" AS ENUM ('OPEN', 'MITIGATING', 'ACCEPTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."IntegrationDeliveryStatus" AS ENUM ('PENDING', 'RETRYING', 'DELIVERED', 'FAILED', 'DEAD_LETTER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."IntegrationEndpointStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEGRADED', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."IntegrationSagaStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'COMPENSATING', 'COMPENSATED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."KnowledgeConfidenceLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERIFIED');

-- CreateEnum
CREATE TYPE "public"."KnowledgeInsightStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."KnowledgeSourceType" AS ENUM ('DOCUMENT', 'DATABASE', 'API', 'HUMAN', 'AGENT', 'EVENT', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "public"."ObsAlertSeverity" AS ENUM ('INFO', 'WARNING', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ObsAlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."ObsHealthStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'DOWN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."ObsLogLevel" AS ENUM ('TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');

-- CreateEnum
CREATE TYPE "public"."ObsMetricKind" AS ENUM ('COUNTER', 'GAUGE', 'HISTOGRAM');

-- CreateEnum
CREATE TYPE "public"."OpsDeploymentStatus" AS ENUM ('PLANNED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'ROLLED_BACK', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."OpsIncidentSeverity" AS ENUM ('SEV1', 'SEV2', 'SEV3', 'SEV4');

-- CreateEnum
CREATE TYPE "public"."OpsIncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."OpsServiceStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'MAINTENANCE', 'OUTAGE', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."RecordStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."SponsorStatus" AS ENUM ('DISCOVERED', 'QUALIFIED', 'CONTACTED', 'RESPONDED', 'NEGOTIATING', 'WON', 'LOST', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."SponsorshipType" AS ENUM ('SPONSORSHIP', 'PRODUCT_PLACEMENT', 'REVIEW', 'AFFILIATE', 'LONG_TERM');

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" TEXT NOT NULL,
    "agentKey" TEXT NOT NULL,
    "organizationUnitId" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "instructions" JSONB NOT NULL,
    "capabilities" JSONB NOT NULL,
    "memoryConfig" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentDecision" (
    "id" TEXT NOT NULL,
    "decisionKey" TEXT NOT NULL,
    "missionId" TEXT,
    "proposedByAgentId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "recommendation" JSONB NOT NULL,
    "riskAssessment" JSONB NOT NULL,
    "status" "public"."AgentDecisionStatus" NOT NULL DEFAULT 'PROPOSED',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentMission" (
    "id" TEXT NOT NULL,
    "missionKey" TEXT NOT NULL,
    "teamId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "public"."AgentMissionPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "public"."AgentMissionStatus" NOT NULL DEFAULT 'DRAFT',
    "objective" JSONB NOT NULL,
    "requiredCapabilities" JSONB NOT NULL,
    "constraints" JSONB NOT NULL,
    "result" JSONB,
    "statusNote" TEXT,
    "metadata" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentMissionAssignment" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "assignmentRole" TEXT NOT NULL,
    "instructions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentMissionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentTeam" (
    "id" TEXT NOT NULL,
    "teamKey" TEXT NOT NULL,
    "organizationUnitId" TEXT,
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "status" "public"."AgentTeamStatus" NOT NULL DEFAULT 'ACTIVE',
    "operatingModel" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentTeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "responsibilities" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AiOrganizationWorkspaceState" (
    "id" TEXT NOT NULL,
    "workspaceKey" TEXT NOT NULL,
    "projectId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiOrganizationWorkspaceState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApprovalGate" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "gateType" TEXT NOT NULL,
    "status" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "decisionNote" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalGate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Blueprint" (
    "id" TEXT NOT NULL,
    "blueprintKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "definition" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blueprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlueprintVersion" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "definition" JSONB NOT NULL,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlueprintVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Capability" (
    "id" TEXT NOT NULL,
    "capabilityKey" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "contract" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "status" "public"."CreatorCredentialStatus" NOT NULL DEFAULT 'ACTIVE',
    "scopes" TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorIdempotencyKey" (
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
CREATE TABLE "public"."CreatorJobRun" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "details" JSONB,

    CONSTRAINT "CreatorJobRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorOutboxEvent" (
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
CREATE TABLE "public"."CreatorPermission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorPersonalAccessToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokenPrefix" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "public"."CreatorCredentialStatus" NOT NULL DEFAULT 'ACTIVE',
    "scopes" TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorPersonalAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorRefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorRole" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorRolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "CreatorRolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "public"."CreatorSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "status" "public"."CreatorSessionStatus" NOT NULL DEFAULT 'ACTIVE',
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

-- CreateTable
CREATE TABLE "public"."CreatorUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "status" "public"."CreatorUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreatorUserProfile" (
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

-- CreateTable
CREATE TABLE "public"."CreatorUserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorUserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "public"."EventDeadLetter" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "EventDeadLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventDelivery" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "status" "public"."EventDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "response" TEXT,
    "lastError" TEXT,
    "nextAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventMessage" (
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
    "priority" "public"."EventMessagePriority" NOT NULL DEFAULT 'NORMAL',
    "payload" JSONB NOT NULL,
    "headers" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventReplay" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "replayKey" TEXT NOT NULL,
    "fromMessageId" TEXT,
    "toMessageId" TEXT,
    "limit" INTEGER NOT NULL DEFAULT 1000,
    "status" "public"."EventReplayStatus" NOT NULL DEFAULT 'PLANNED',
    "processedCount" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventReplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventSubscription" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subscriptionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "consumerType" TEXT NOT NULL,
    "endpoint" TEXT,
    "status" "public"."EventSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "retryDelaySeconds" INTEGER NOT NULL DEFAULT 60,
    "filter" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventTopic" (
    "id" TEXT NOT NULL,
    "topicKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."EventTopicStatus" NOT NULL DEFAULT 'ACTIVE',
    "partitions" INTEGER NOT NULL DEFAULT 1,
    "retentionDays" INTEGER NOT NULL DEFAULT 30,
    "ordered" BOOLEAN NOT NULL DEFAULT false,
    "schema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExecutionJob" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "jobKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assignedAgentId" TEXT,
    "runtimeProviderId" TEXT,
    "capability" TEXT,
    "status" "public"."ExecutionStatus" NOT NULL DEFAULT 'PENDING',
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

    CONSTRAINT "ExecutionJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExecutionPlan" (
    "id" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "planKey" TEXT NOT NULL,
    "status" "public"."ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "definition" JSONB NOT NULL,
    "result" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExecutionResult" (
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

    CONSTRAINT "ExecutionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExecutionSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "projectId" TEXT,
    "sessionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "status" "public"."ExecutionStatus" NOT NULL DEFAULT 'PENDING',
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

    CONSTRAINT "ExecutionSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExecutionStep" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" "public"."ExecutionStatus" NOT NULL DEFAULT 'PENDING',
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

    CONSTRAINT "ExecutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernanceAssessment" (
    "id" TEXT NOT NULL,
    "policyId" TEXT,
    "riskId" TEXT,
    "ruleId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT,
    "status" "public"."GovernanceComplianceStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
    "score" INTEGER,
    "findings" JSONB,
    "evidence" JSONB,
    "assessedBy" TEXT,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernanceChangeRequest" (
    "id" TEXT NOT NULL,
    "changeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "impactAnalysis" JSONB NOT NULL,
    "rollbackPlan" TEXT,
    "status" "public"."GovernanceChangeStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedBy" TEXT,
    "approvedBy" TEXT,
    "implementedBy" TEXT,
    "submittedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "implementedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernanceComplianceRule" (
    "id" TEXT NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "framework" TEXT NOT NULL,
    "control" TEXT NOT NULL,
    "severity" "public"."GovernanceRiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "evidence" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceComplianceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernanceDecision" (
    "id" TEXT NOT NULL,
    "decisionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "consequences" TEXT,
    "alternatives" JSONB,
    "status" "public"."GovernanceDecisionStatus" NOT NULL DEFAULT 'PROPOSED',
    "decisionType" TEXT NOT NULL DEFAULT 'ADR',
    "owner" TEXT,
    "approvedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "supersedesId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernancePolicy" (
    "id" TEXT NOT NULL,
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "public"."GovernancePolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "category" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "owner" TEXT,
    "effectiveAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernancePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernanceRisk" (
    "id" TEXT NOT NULL,
    "riskKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "likelihood" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "level" "public"."GovernanceRiskLevel" NOT NULL,
    "status" "public"."GovernanceRiskStatus" NOT NULL DEFAULT 'OPEN',
    "owner" TEXT,
    "mitigationPlan" TEXT,
    "contingencyPlan" TEXT,
    "reviewAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Integration" (
    "id" TEXT NOT NULL,
    "integrationKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "configuration" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationDelivery" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "status" "public"."IntegrationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "responseBody" TEXT,
    "lastError" TEXT,
    "nextAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationEndpoint" (
    "id" TEXT NOT NULL,
    "endpointKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."IntegrationEndpointStatus" NOT NULL DEFAULT 'ACTIVE',
    "configuration" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT,
    "payload" JSONB NOT NULL,
    "correlationId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationEventDefinition" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "schema" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationEventDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationSaga" (
    "id" TEXT NOT NULL,
    "sagaKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "correlationId" TEXT,
    "status" "public"."IntegrationSagaStatus" NOT NULL DEFAULT 'RUNNING',
    "state" JSONB NOT NULL,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationSaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrationWebhook" (
    "id" TEXT NOT NULL,
    "webhookKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "eventNames" JSONB NOT NULL,
    "secret" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeEdge" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeEvidence" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "confidence" "public"."KnowledgeConfidenceLevel" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "context" JSONB NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeInsight" (
    "id" TEXT NOT NULL,
    "insightKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence" "public"."KnowledgeConfidenceLevel" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "status" "public"."KnowledgeInsightStatus" NOT NULL DEFAULT 'PROPOSED',
    "nodeId" TEXT,
    "evidenceIds" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeNode" (
    "id" TEXT NOT NULL,
    "nodeKey" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "properties" JSONB NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeSource" (
    "id" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."KnowledgeSourceType" NOT NULL,
    "uri" TEXT,
    "metadata" JSONB NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObsAlertEvent" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT,
    "fingerprint" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "public"."ObsAlertSeverity" NOT NULL,
    "status" "public"."ObsAlertStatus" NOT NULL DEFAULT 'OPEN',
    "service" TEXT,
    "currentValue" DOUBLE PRECISION,
    "note" TEXT,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObsAlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObsAlertRule" (
    "id" TEXT NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "severity" "public"."ObsAlertSeverity" NOT NULL,
    "evaluationWindowMinutes" INTEGER NOT NULL DEFAULT 5,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "labels" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObsAlertRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObsHealthCheck" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" "public"."ObsHealthStatus" NOT NULL DEFAULT 'UNKNOWN',
    "latencyMs" DOUBLE PRECISION,
    "message" TEXT,
    "details" JSONB NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObsHealthCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObsLogEntry" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "level" "public"."ObsLogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "traceId" TEXT,
    "spanId" TEXT,
    "context" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObsLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObsMetric" (
    "id" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "kind" "public"."ObsMetricKind" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "labels" JSONB NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObsMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ObsTraceSpan" (
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

-- CreateTable
CREATE TABLE "public"."OpsDeployment" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'production',
    "status" "public"."OpsDeploymentStatus" NOT NULL DEFAULT 'PLANNED',
    "initiatedBy" TEXT,
    "notes" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpsDeployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpsIncident" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "public"."OpsIncidentSeverity" NOT NULL,
    "status" "public"."OpsIncidentStatus" NOT NULL DEFAULT 'OPEN',
    "commander" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpsIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpsRunbook" (
    "id" TEXT NOT NULL,
    "runbookKey" TEXT NOT NULL,
    "serviceId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "owner" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpsRunbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpsService" (
    "id" TEXT NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner" TEXT,
    "status" "public"."OpsServiceStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpsService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpsSla" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetAvailability" INTEGER NOT NULL,
    "responseMinutes" INTEGER NOT NULL,
    "resolutionMinutes" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpsSla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationUnit" (
    "id" TEXT NOT NULL,
    "unitKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "purpose" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductionPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "strategy" JSONB NOT NULL,
    "audience" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RuntimePlugin" (
    "id" TEXT NOT NULL,
    "pluginKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" "public"."RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "capabilities" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuntimePlugin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyKey" TEXT NOT NULL,
    "industry" TEXT,
    "country" TEXT,
    "website" TEXT,
    "status" "public"."SponsorStatus" NOT NULL DEFAULT 'DISCOVERED',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SponsorInteraction" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsorInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SponsorshipCampaign" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "campaignType" "public"."SponsorshipType" NOT NULL,
    "budget" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorshipCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SponsorshipOpportunity" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorshipOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SponsorshipProposal" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "proposalType" "public"."SponsorshipType" NOT NULL,
    "estimatedValue" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorshipProposal_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "public"."media_channel_families" (
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
CREATE TABLE "public"."media_channels" (
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
CREATE TABLE "public"."media_content_ideas" (
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
CREATE TABLE "public"."media_domain_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "payload" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_domain_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_human_approvals" (
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
CREATE TABLE "public"."media_projects" (
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
CREATE UNIQUE INDEX "Agent_agentKey_key" ON "public"."Agent"("agentKey" ASC);

-- CreateIndex
CREATE INDEX "Agent_organizationUnitId_idx" ON "public"."Agent"("organizationUnitId" ASC);

-- CreateIndex
CREATE INDEX "Agent_role_idx" ON "public"."Agent"("role" ASC);

-- CreateIndex
CREATE INDEX "Agent_status_idx" ON "public"."Agent"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AgentDecision_decisionKey_key" ON "public"."AgentDecision"("decisionKey" ASC);

-- CreateIndex
CREATE INDEX "AgentDecision_missionId_idx" ON "public"."AgentDecision"("missionId" ASC);

-- CreateIndex
CREATE INDEX "AgentDecision_proposedByAgentId_idx" ON "public"."AgentDecision"("proposedByAgentId" ASC);

-- CreateIndex
CREATE INDEX "AgentDecision_status_idx" ON "public"."AgentDecision"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AgentMission_missionKey_key" ON "public"."AgentMission"("missionKey" ASC);

-- CreateIndex
CREATE INDEX "AgentMission_status_priority_idx" ON "public"."AgentMission"("status" ASC, "priority" ASC);

-- CreateIndex
CREATE INDEX "AgentMission_teamId_idx" ON "public"."AgentMission"("teamId" ASC);

-- CreateIndex
CREATE INDEX "AgentMissionAssignment_agentId_idx" ON "public"."AgentMissionAssignment"("agentId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AgentMissionAssignment_missionId_agentId_key" ON "public"."AgentMissionAssignment"("missionId" ASC, "agentId" ASC);

-- CreateIndex
CREATE INDEX "AgentTeam_organizationUnitId_idx" ON "public"."AgentTeam"("organizationUnitId" ASC);

-- CreateIndex
CREATE INDEX "AgentTeam_status_idx" ON "public"."AgentTeam"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AgentTeam_teamKey_key" ON "public"."AgentTeam"("teamKey" ASC);

-- CreateIndex
CREATE INDEX "AgentTeamMember_agentId_idx" ON "public"."AgentTeamMember"("agentId" ASC);

-- CreateIndex
CREATE INDEX "AgentTeamMember_role_idx" ON "public"."AgentTeamMember"("role" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AgentTeamMember_teamId_agentId_key" ON "public"."AgentTeamMember"("teamId" ASC, "agentId" ASC);

-- CreateIndex
CREATE INDEX "AiOrganizationWorkspaceState_projectId_idx" ON "public"."AiOrganizationWorkspaceState"("projectId" ASC);

-- CreateIndex
CREATE INDEX "AiOrganizationWorkspaceState_updatedAt_idx" ON "public"."AiOrganizationWorkspaceState"("updatedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiOrganizationWorkspaceState_workspaceKey_key" ON "public"."AiOrganizationWorkspaceState"("workspaceKey" ASC);

-- CreateIndex
CREATE INDEX "ApprovalGate_blueprintId_idx" ON "public"."ApprovalGate"("blueprintId" ASC);

-- CreateIndex
CREATE INDEX "ApprovalGate_status_idx" ON "public"."ApprovalGate"("status" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "public"."AuditLog"("actorId" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_eventType_idx" ON "public"."AuditLog"("eventType" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_occurredAt_idx" ON "public"."AuditLog"("occurredAt" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_resourceId_idx" ON "public"."AuditLog"("resourceType" ASC, "resourceId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Blueprint_blueprintKey_key" ON "public"."Blueprint"("blueprintKey" ASC);

-- CreateIndex
CREATE INDEX "Blueprint_status_idx" ON "public"."Blueprint"("status" ASC);

-- CreateIndex
CREATE INDEX "BlueprintVersion_blueprintId_idx" ON "public"."BlueprintVersion"("blueprintId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "BlueprintVersion_blueprintId_version_key" ON "public"."BlueprintVersion"("blueprintId" ASC, "version" ASC);

-- CreateIndex
CREATE INDEX "Brand_sponsorId_idx" ON "public"."Brand"("sponsorId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Capability_capabilityKey_key" ON "public"."Capability"("capabilityKey" ASC);

-- CreateIndex
CREATE INDEX "Capability_domain_idx" ON "public"."Capability"("domain" ASC);

-- CreateIndex
CREATE INDEX "Capability_status_idx" ON "public"."Capability"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorApiKey_keyHash_key" ON "public"."CreatorApiKey"("keyHash" ASC);

-- CreateIndex
CREATE INDEX "CreatorApiKey_keyPrefix_idx" ON "public"."CreatorApiKey"("keyPrefix" ASC);

-- CreateIndex
CREATE INDEX "CreatorApiKey_userId_status_idx" ON "public"."CreatorApiKey"("userId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "CreatorIdempotencyKey_expiresAt_idx" ON "public"."CreatorIdempotencyKey"("expiresAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorIdempotencyKey_key_key" ON "public"."CreatorIdempotencyKey"("key" ASC);

-- CreateIndex
CREATE INDEX "CreatorJobRun_jobName_startedAt_idx" ON "public"."CreatorJobRun"("jobName" ASC, "startedAt" ASC);

-- CreateIndex
CREATE INDEX "CreatorOutboxEvent_publishedAt_occurredAt_idx" ON "public"."CreatorOutboxEvent"("publishedAt" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPermission_key_key" ON "public"."CreatorPermission"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPersonalAccessToken_tokenHash_key" ON "public"."CreatorPersonalAccessToken"("tokenHash" ASC);

-- CreateIndex
CREATE INDEX "CreatorPersonalAccessToken_tokenPrefix_idx" ON "public"."CreatorPersonalAccessToken"("tokenPrefix" ASC);

-- CreateIndex
CREATE INDEX "CreatorPersonalAccessToken_userId_status_idx" ON "public"."CreatorPersonalAccessToken"("userId" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorRefreshToken_tokenHash_key" ON "public"."CreatorRefreshToken"("tokenHash" ASC);

-- CreateIndex
CREATE INDEX "CreatorRefreshToken_userId_expiresAt_idx" ON "public"."CreatorRefreshToken"("userId" ASC, "expiresAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorRole_key_key" ON "public"."CreatorRole"("key" ASC);

-- CreateIndex
CREATE INDEX "CreatorSession_expiresAt_idx" ON "public"."CreatorSession"("expiresAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorSession_sessionKey_key" ON "public"."CreatorSession"("sessionKey" ASC);

-- CreateIndex
CREATE INDEX "CreatorSession_userId_status_idx" ON "public"."CreatorSession"("userId" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorUser_email_key" ON "public"."CreatorUser"("email" ASC);

-- CreateIndex
CREATE INDEX "CreatorUser_status_idx" ON "public"."CreatorUser"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorUser_username_key" ON "public"."CreatorUser"("username" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorUserProfile_userId_key" ON "public"."CreatorUserProfile"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EventDeadLetter_deliveryId_key" ON "public"."EventDeadLetter"("deliveryId" ASC);

-- CreateIndex
CREATE INDEX "EventDeadLetter_resolvedAt_createdAt_idx" ON "public"."EventDeadLetter"("resolvedAt" ASC, "createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EventDelivery_messageId_subscriptionId_key" ON "public"."EventDelivery"("messageId" ASC, "subscriptionId" ASC);

-- CreateIndex
CREATE INDEX "EventDelivery_status_nextAttemptAt_idx" ON "public"."EventDelivery"("status" ASC, "nextAttemptAt" ASC);

-- CreateIndex
CREATE INDEX "EventDelivery_subscriptionId_status_idx" ON "public"."EventDelivery"("subscriptionId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "EventMessage_correlationId_idx" ON "public"."EventMessage"("correlationId" ASC);

-- CreateIndex
CREATE INDEX "EventMessage_eventName_occurredAt_idx" ON "public"."EventMessage"("eventName" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EventMessage_idempotencyKey_key" ON "public"."EventMessage"("idempotencyKey" ASC);

-- CreateIndex
CREATE INDEX "EventMessage_topicId_occurredAt_idx" ON "public"."EventMessage"("topicId" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EventReplay_replayKey_key" ON "public"."EventReplay"("replayKey" ASC);

-- CreateIndex
CREATE INDEX "EventReplay_status_createdAt_idx" ON "public"."EventReplay"("status" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "EventReplay_topicId_idx" ON "public"."EventReplay"("topicId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EventSubscription_subscriptionKey_key" ON "public"."EventSubscription"("subscriptionKey" ASC);

-- CreateIndex
CREATE INDEX "EventSubscription_topicId_status_idx" ON "public"."EventSubscription"("topicId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "EventTopic_status_updatedAt_idx" ON "public"."EventTopic"("status" ASC, "updatedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EventTopic_topicKey_key" ON "public"."EventTopic"("topicKey" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_assignedAgentId_idx" ON "public"."ExecutionJob"("assignedAgentId" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_capability_idx" ON "public"."ExecutionJob"("capability" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_priority_idx" ON "public"."ExecutionJob"("priority" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_runtimeProviderId_idx" ON "public"."ExecutionJob"("runtimeProviderId" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_sequence_idx" ON "public"."ExecutionJob"("sequence" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_sessionId_idx" ON "public"."ExecutionJob"("sessionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionJob_sessionId_jobKey_key" ON "public"."ExecutionJob"("sessionId" ASC, "jobKey" ASC);

-- CreateIndex
CREATE INDEX "ExecutionJob_status_idx" ON "public"."ExecutionJob"("status" ASC);

-- CreateIndex
CREATE INDEX "ExecutionPlan_blueprintId_idx" ON "public"."ExecutionPlan"("blueprintId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionPlan_planKey_key" ON "public"."ExecutionPlan"("planKey" ASC);

-- CreateIndex
CREATE INDEX "ExecutionPlan_status_idx" ON "public"."ExecutionPlan"("status" ASC);

-- CreateIndex
CREATE INDEX "ExecutionResult_createdAt_idx" ON "public"."ExecutionResult"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ExecutionResult_resultType_idx" ON "public"."ExecutionResult"("resultType" ASC);

-- CreateIndex
CREATE INDEX "ExecutionResult_stepId_idx" ON "public"."ExecutionResult"("stepId" ASC);

-- CreateIndex
CREATE INDEX "ExecutionResult_success_idx" ON "public"."ExecutionResult"("success" ASC);

-- CreateIndex
CREATE INDEX "ExecutionSession_createdAt_idx" ON "public"."ExecutionSession"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ExecutionSession_projectId_idx" ON "public"."ExecutionSession"("projectId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionSession_sessionKey_key" ON "public"."ExecutionSession"("sessionKey" ASC);

-- CreateIndex
CREATE INDEX "ExecutionSession_status_idx" ON "public"."ExecutionSession"("status" ASC);

-- CreateIndex
CREATE INDEX "ExecutionSession_updatedAt_idx" ON "public"."ExecutionSession"("updatedAt" ASC);

-- CreateIndex
CREATE INDEX "ExecutionSession_workspaceId_idx" ON "public"."ExecutionSession"("workspaceId" ASC);

-- CreateIndex
CREATE INDEX "ExecutionStep_jobId_idx" ON "public"."ExecutionStep"("jobId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionStep_jobId_stepKey_key" ON "public"."ExecutionStep"("jobId" ASC, "stepKey" ASC);

-- CreateIndex
CREATE INDEX "ExecutionStep_runtimeProviderId_idx" ON "public"."ExecutionStep"("runtimeProviderId" ASC);

-- CreateIndex
CREATE INDEX "ExecutionStep_sequence_idx" ON "public"."ExecutionStep"("sequence" ASC);

-- CreateIndex
CREATE INDEX "ExecutionStep_status_idx" ON "public"."ExecutionStep"("status" ASC);

-- CreateIndex
CREATE INDEX "GovernanceAssessment_policyId_idx" ON "public"."GovernanceAssessment"("policyId" ASC);

-- CreateIndex
CREATE INDEX "GovernanceAssessment_riskId_idx" ON "public"."GovernanceAssessment"("riskId" ASC);

-- CreateIndex
CREATE INDEX "GovernanceAssessment_ruleId_idx" ON "public"."GovernanceAssessment"("ruleId" ASC);

-- CreateIndex
CREATE INDEX "GovernanceAssessment_status_idx" ON "public"."GovernanceAssessment"("status" ASC);

-- CreateIndex
CREATE INDEX "GovernanceAssessment_subjectType_subjectId_idx" ON "public"."GovernanceAssessment"("subjectType" ASC, "subjectId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GovernanceChangeRequest_changeKey_key" ON "public"."GovernanceChangeRequest"("changeKey" ASC);

-- CreateIndex
CREATE INDEX "GovernanceChangeRequest_status_idx" ON "public"."GovernanceChangeRequest"("status" ASC);

-- CreateIndex
CREATE INDEX "GovernanceComplianceRule_active_idx" ON "public"."GovernanceComplianceRule"("active" ASC);

-- CreateIndex
CREATE INDEX "GovernanceComplianceRule_framework_idx" ON "public"."GovernanceComplianceRule"("framework" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GovernanceComplianceRule_ruleKey_key" ON "public"."GovernanceComplianceRule"("ruleKey" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GovernanceDecision_decisionKey_key" ON "public"."GovernanceDecision"("decisionKey" ASC);

-- CreateIndex
CREATE INDEX "GovernanceDecision_decisionType_idx" ON "public"."GovernanceDecision"("decisionType" ASC);

-- CreateIndex
CREATE INDEX "GovernanceDecision_status_idx" ON "public"."GovernanceDecision"("status" ASC);

-- CreateIndex
CREATE INDEX "GovernancePolicy_category_idx" ON "public"."GovernancePolicy"("category" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GovernancePolicy_policyKey_key" ON "public"."GovernancePolicy"("policyKey" ASC);

-- CreateIndex
CREATE INDEX "GovernancePolicy_status_idx" ON "public"."GovernancePolicy"("status" ASC);

-- CreateIndex
CREATE INDEX "GovernanceRisk_category_idx" ON "public"."GovernanceRisk"("category" ASC);

-- CreateIndex
CREATE INDEX "GovernanceRisk_level_idx" ON "public"."GovernanceRisk"("level" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GovernanceRisk_riskKey_key" ON "public"."GovernanceRisk"("riskKey" ASC);

-- CreateIndex
CREATE INDEX "GovernanceRisk_status_idx" ON "public"."GovernanceRisk"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Integration_integrationKey_key" ON "public"."Integration"("integrationKey" ASC);

-- CreateIndex
CREATE INDEX "Integration_status_idx" ON "public"."Integration"("status" ASC);

-- CreateIndex
CREATE INDEX "Integration_type_idx" ON "public"."Integration"("type" ASC);

-- CreateIndex
CREATE INDEX "IntegrationDelivery_eventId_idx" ON "public"."IntegrationDelivery"("eventId" ASC);

-- CreateIndex
CREATE INDEX "IntegrationDelivery_status_nextAttemptAt_idx" ON "public"."IntegrationDelivery"("status" ASC, "nextAttemptAt" ASC);

-- CreateIndex
CREATE INDEX "IntegrationDelivery_webhookId_idx" ON "public"."IntegrationDelivery"("webhookId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationEndpoint_endpointKey_key" ON "public"."IntegrationEndpoint"("endpointKey" ASC);

-- CreateIndex
CREATE INDEX "IntegrationEndpoint_type_status_idx" ON "public"."IntegrationEndpoint"("type" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "IntegrationEvent_correlationId_idx" ON "public"."IntegrationEvent"("correlationId" ASC);

-- CreateIndex
CREATE INDEX "IntegrationEvent_eventName_occurredAt_idx" ON "public"."IntegrationEvent"("eventName" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE INDEX "IntegrationEventDefinition_domain_active_idx" ON "public"."IntegrationEventDefinition"("domain" ASC, "active" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationEventDefinition_eventName_key" ON "public"."IntegrationEventDefinition"("eventName" ASC);

-- CreateIndex
CREATE INDEX "IntegrationSaga_correlationId_idx" ON "public"."IntegrationSaga"("correlationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationSaga_sagaKey_key" ON "public"."IntegrationSaga"("sagaKey" ASC);

-- CreateIndex
CREATE INDEX "IntegrationSaga_status_updatedAt_idx" ON "public"."IntegrationSaga"("status" ASC, "updatedAt" ASC);

-- CreateIndex
CREATE INDEX "IntegrationWebhook_active_idx" ON "public"."IntegrationWebhook"("active" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationWebhook_webhookKey_key" ON "public"."IntegrationWebhook"("webhookKey" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeEdge_relation_idx" ON "public"."KnowledgeEdge"("relation" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeEdge_sourceId_idx" ON "public"."KnowledgeEdge"("sourceId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeEdge_sourceId_targetId_relation_key" ON "public"."KnowledgeEdge"("sourceId" ASC, "targetId" ASC, "relation" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeEdge_targetId_idx" ON "public"."KnowledgeEdge"("targetId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeEvidence_nodeId_confidence_idx" ON "public"."KnowledgeEvidence"("nodeId" ASC, "confidence" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeEvidence_sourceId_observedAt_idx" ON "public"."KnowledgeEvidence"("sourceId" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeInsight_category_updatedAt_idx" ON "public"."KnowledgeInsight"("category" ASC, "updatedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeInsight_insightKey_key" ON "public"."KnowledgeInsight"("insightKey" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeInsight_nodeId_idx" ON "public"."KnowledgeInsight"("nodeId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeInsight_status_confidence_idx" ON "public"."KnowledgeInsight"("status" ASC, "confidence" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeNode_nodeKey_key" ON "public"."KnowledgeNode"("nodeKey" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeNode_status_idx" ON "public"."KnowledgeNode"("status" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeNode_type_idx" ON "public"."KnowledgeNode"("type" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeSource_sourceKey_key" ON "public"."KnowledgeSource"("sourceKey" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeSource_type_status_idx" ON "public"."KnowledgeSource"("type" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ObsAlertEvent_fingerprint_key" ON "public"."ObsAlertEvent"("fingerprint" ASC);

-- CreateIndex
CREATE INDEX "ObsAlertEvent_ruleId_idx" ON "public"."ObsAlertEvent"("ruleId" ASC);

-- CreateIndex
CREATE INDEX "ObsAlertEvent_service_triggeredAt_idx" ON "public"."ObsAlertEvent"("service" ASC, "triggeredAt" ASC);

-- CreateIndex
CREATE INDEX "ObsAlertEvent_status_severity_idx" ON "public"."ObsAlertEvent"("status" ASC, "severity" ASC);

-- CreateIndex
CREATE INDEX "ObsAlertRule_enabled_severity_idx" ON "public"."ObsAlertRule"("enabled" ASC, "severity" ASC);

-- CreateIndex
CREATE INDEX "ObsAlertRule_metricKey_idx" ON "public"."ObsAlertRule"("metricKey" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ObsAlertRule_ruleKey_key" ON "public"."ObsAlertRule"("ruleKey" ASC);

-- CreateIndex
CREATE INDEX "ObsHealthCheck_service_checkedAt_idx" ON "public"."ObsHealthCheck"("service" ASC, "checkedAt" ASC);

-- CreateIndex
CREATE INDEX "ObsHealthCheck_status_checkedAt_idx" ON "public"."ObsHealthCheck"("status" ASC, "checkedAt" ASC);

-- CreateIndex
CREATE INDEX "ObsLogEntry_level_occurredAt_idx" ON "public"."ObsLogEntry"("level" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE INDEX "ObsLogEntry_service_occurredAt_idx" ON "public"."ObsLogEntry"("service" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE INDEX "ObsLogEntry_traceId_idx" ON "public"."ObsLogEntry"("traceId" ASC);

-- CreateIndex
CREATE INDEX "ObsMetric_metricKey_observedAt_idx" ON "public"."ObsMetric"("metricKey" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "ObsMetric_service_observedAt_idx" ON "public"."ObsMetric"("service" ASC, "observedAt" ASC);

-- CreateIndex
CREATE INDEX "ObsTraceSpan_service_startedAt_idx" ON "public"."ObsTraceSpan"("service" ASC, "startedAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ObsTraceSpan_spanId_key" ON "public"."ObsTraceSpan"("spanId" ASC);

-- CreateIndex
CREATE INDEX "ObsTraceSpan_traceId_startedAt_idx" ON "public"."ObsTraceSpan"("traceId" ASC, "startedAt" ASC);

-- CreateIndex
CREATE INDEX "OpsDeployment_createdAt_idx" ON "public"."OpsDeployment"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "OpsDeployment_serviceId_status_idx" ON "public"."OpsDeployment"("serviceId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "OpsIncident_createdAt_idx" ON "public"."OpsIncident"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "OpsIncident_serviceId_idx" ON "public"."OpsIncident"("serviceId" ASC);

-- CreateIndex
CREATE INDEX "OpsIncident_severity_status_idx" ON "public"."OpsIncident"("severity" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OpsRunbook_runbookKey_key" ON "public"."OpsRunbook"("runbookKey" ASC);

-- CreateIndex
CREATE INDEX "OpsRunbook_serviceId_active_idx" ON "public"."OpsRunbook"("serviceId" ASC, "active" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OpsService_serviceKey_key" ON "public"."OpsService"("serviceKey" ASC);

-- CreateIndex
CREATE INDEX "OpsService_status_idx" ON "public"."OpsService"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OpsSla_serviceId_key" ON "public"."OpsSla"("serviceId" ASC);

-- CreateIndex
CREATE INDEX "OrganizationUnit_status_idx" ON "public"."OrganizationUnit"("status" ASC);

-- CreateIndex
CREATE INDEX "OrganizationUnit_type_idx" ON "public"."OrganizationUnit"("type" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUnit_unitKey_key" ON "public"."OrganizationUnit"("unitKey" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "RuntimePlugin_pluginKey_key" ON "public"."RuntimePlugin"("pluginKey" ASC);

-- CreateIndex
CREATE INDEX "RuntimePlugin_status_idx" ON "public"."RuntimePlugin"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_companyKey_key" ON "public"."Sponsor"("companyKey" ASC);

-- CreateIndex
CREATE INDEX "Sponsor_industry_idx" ON "public"."Sponsor"("industry" ASC);

-- CreateIndex
CREATE INDEX "Sponsor_status_idx" ON "public"."Sponsor"("status" ASC);

-- CreateIndex
CREATE INDEX "SponsorshipOpportunity_score_idx" ON "public"."SponsorshipOpportunity"("score" ASC);

-- CreateIndex
CREATE INDEX "media_audience_profiles_projectId_idx" ON "public"."media_audience_profiles"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_channel_families_projectId_idx" ON "public"."media_channel_families"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_channels_familyId_idx" ON "public"."media_channels"("familyId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "media_channels_familyId_language_key" ON "public"."media_channels"("familyId" ASC, "language" ASC);

-- CreateIndex
CREATE INDEX "media_channels_projectId_idx" ON "public"."media_channels"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_competitors_projectId_idx" ON "public"."media_competitors"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_content_ideas_channelFamilyId_idx" ON "public"."media_content_ideas"("channelFamilyId" ASC);

-- CreateIndex
CREATE INDEX "media_content_ideas_projectId_idx" ON "public"."media_content_ideas"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_domain_events_entityType_entityId_idx" ON "public"."media_domain_events"("entityType" ASC, "entityId" ASC);

-- CreateIndex
CREATE INDEX "media_domain_events_eventType_idx" ON "public"."media_domain_events"("eventType" ASC);

-- CreateIndex
CREATE INDEX "media_human_approvals_entityType_entityId_idx" ON "public"."media_human_approvals"("entityType" ASC, "entityId" ASC);

-- CreateIndex
CREATE INDEX "media_human_approvals_status_idx" ON "public"."media_human_approvals"("status" ASC);

-- CreateIndex
CREATE INDEX "media_opportunities_projectId_idx" ON "public"."media_opportunities"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_opportunities_status_idx" ON "public"."media_opportunities"("status" ASC);

-- CreateIndex
CREATE INDEX "media_research_projectId_idx" ON "public"."media_research"("projectId" ASC);

-- CreateIndex
CREATE INDEX "media_trends_projectId_idx" ON "public"."media_trends"("projectId" ASC);

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "public"."OrganizationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentDecision" ADD CONSTRAINT "AgentDecision_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."AgentMission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentDecision" ADD CONSTRAINT "AgentDecision_proposedByAgentId_fkey" FOREIGN KEY ("proposedByAgentId") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentMission" ADD CONSTRAINT "AgentMission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."AgentTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentMissionAssignment" ADD CONSTRAINT "AgentMissionAssignment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentMissionAssignment" ADD CONSTRAINT "AgentMissionAssignment_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."AgentMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentTeam" ADD CONSTRAINT "AgentTeam_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "public"."OrganizationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentTeamMember" ADD CONSTRAINT "AgentTeamMember_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentTeamMember" ADD CONSTRAINT "AgentTeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."AgentTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalGate" ADD CONSTRAINT "ApprovalGate_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "public"."Blueprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlueprintVersion" ADD CONSTRAINT "BlueprintVersion_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "public"."Blueprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorApiKey" ADD CONSTRAINT "CreatorApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorPersonalAccessToken" ADD CONSTRAINT "CreatorPersonalAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorRefreshToken" ADD CONSTRAINT "CreatorRefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorRolePermission" ADD CONSTRAINT "CreatorRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."CreatorPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorRolePermission" ADD CONSTRAINT "CreatorRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."CreatorRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorSession" ADD CONSTRAINT "CreatorSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorUserProfile" ADD CONSTRAINT "CreatorUserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorUserRole" ADD CONSTRAINT "CreatorUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."CreatorRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CreatorUserRole" ADD CONSTRAINT "CreatorUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."CreatorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDeadLetter" ADD CONSTRAINT "EventDeadLetter_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."EventDelivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDelivery" ADD CONSTRAINT "EventDelivery_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."EventMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDelivery" ADD CONSTRAINT "EventDelivery_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."EventSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventMessage" ADD CONSTRAINT "EventMessage_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."EventTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventReplay" ADD CONSTRAINT "EventReplay_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."EventSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventReplay" ADD CONSTRAINT "EventReplay_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."EventTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventSubscription" ADD CONSTRAINT "EventSubscription_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."EventTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionJob" ADD CONSTRAINT "ExecutionJob_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ExecutionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionPlan" ADD CONSTRAINT "ExecutionPlan_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "public"."Blueprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionResult" ADD CONSTRAINT "ExecutionResult_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "public"."ExecutionStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionSession" ADD CONSTRAINT "ExecutionSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."AiOrganizationWorkspaceState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionStep" ADD CONSTRAINT "ExecutionStep_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."ExecutionJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GovernanceAssessment" ADD CONSTRAINT "GovernanceAssessment_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "public"."GovernancePolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GovernanceAssessment" ADD CONSTRAINT "GovernanceAssessment_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "public"."GovernanceRisk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GovernanceAssessment" ADD CONSTRAINT "GovernanceAssessment_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."GovernanceComplianceRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IntegrationDelivery" ADD CONSTRAINT "IntegrationDelivery_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."IntegrationEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IntegrationDelivery" ADD CONSTRAINT "IntegrationDelivery_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "public"."IntegrationWebhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeEdge" ADD CONSTRAINT "KnowledgeEdge_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeEvidence" ADD CONSTRAINT "KnowledgeEvidence_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeEvidence" ADD CONSTRAINT "KnowledgeEvidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "public"."KnowledgeSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KnowledgeInsight" ADD CONSTRAINT "KnowledgeInsight_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ObsAlertEvent" ADD CONSTRAINT "ObsAlertEvent_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."ObsAlertRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpsDeployment" ADD CONSTRAINT "OpsDeployment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."OpsService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpsIncident" ADD CONSTRAINT "OpsIncident_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."OpsService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpsRunbook" ADD CONSTRAINT "OpsRunbook_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."OpsService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpsSla" ADD CONSTRAINT "OpsSla_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."OpsService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SponsorInteraction" ADD CONSTRAINT "SponsorInteraction_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SponsorshipCampaign" ADD CONSTRAINT "SponsorshipCampaign_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SponsorshipOpportunity" ADD CONSTRAINT "SponsorshipOpportunity_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SponsorshipProposal" ADD CONSTRAINT "SponsorshipProposal_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
