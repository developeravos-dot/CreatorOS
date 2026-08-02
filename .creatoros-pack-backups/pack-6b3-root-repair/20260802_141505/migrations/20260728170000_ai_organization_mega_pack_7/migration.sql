CREATE TYPE "AgentTeamStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'RETIRED');
CREATE TYPE "AgentMissionPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');
CREATE TYPE "AgentMissionStatus" AS ENUM ('DRAFT', 'QUEUED', 'RUNNING', 'BLOCKED', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "AgentDecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED');

CREATE TABLE "AgentTeam" (
  "id" TEXT NOT NULL,
  "teamKey" TEXT NOT NULL,
  "organizationUnitId" TEXT,
  "name" TEXT NOT NULL,
  "purpose" TEXT,
  "status" "AgentTeamStatus" NOT NULL DEFAULT 'ACTIVE',
  "operatingModel" JSONB NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AgentTeam_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AgentTeamMember" (
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

CREATE TABLE "AgentMission" (
  "id" TEXT NOT NULL,
  "missionKey" TEXT NOT NULL,
  "teamId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "priority" "AgentMissionPriority" NOT NULL DEFAULT 'NORMAL',
  "status" "AgentMissionStatus" NOT NULL DEFAULT 'DRAFT',
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

CREATE TABLE "AgentMissionAssignment" (
  "id" TEXT NOT NULL,
  "missionId" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "assignmentRole" TEXT NOT NULL,
  "instructions" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AgentMissionAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AgentDecision" (
  "id" TEXT NOT NULL,
  "decisionKey" TEXT NOT NULL,
  "missionId" TEXT,
  "proposedByAgentId" TEXT,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "options" JSONB NOT NULL,
  "recommendation" JSONB NOT NULL,
  "riskAssessment" JSONB NOT NULL,
  "status" "AgentDecisionStatus" NOT NULL DEFAULT 'PROPOSED',
  "reviewNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AgentDecision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgentTeam_teamKey_key" ON "AgentTeam"("teamKey");
CREATE INDEX "AgentTeam_organizationUnitId_idx" ON "AgentTeam"("organizationUnitId");
CREATE INDEX "AgentTeam_status_idx" ON "AgentTeam"("status");
CREATE UNIQUE INDEX "AgentTeamMember_teamId_agentId_key" ON "AgentTeamMember"("teamId", "agentId");
CREATE INDEX "AgentTeamMember_agentId_idx" ON "AgentTeamMember"("agentId");
CREATE INDEX "AgentTeamMember_role_idx" ON "AgentTeamMember"("role");
CREATE UNIQUE INDEX "AgentMission_missionKey_key" ON "AgentMission"("missionKey");
CREATE INDEX "AgentMission_teamId_idx" ON "AgentMission"("teamId");
CREATE INDEX "AgentMission_status_priority_idx" ON "AgentMission"("status", "priority");
CREATE UNIQUE INDEX "AgentMissionAssignment_missionId_agentId_key" ON "AgentMissionAssignment"("missionId", "agentId");
CREATE INDEX "AgentMissionAssignment_agentId_idx" ON "AgentMissionAssignment"("agentId");
CREATE UNIQUE INDEX "AgentDecision_decisionKey_key" ON "AgentDecision"("decisionKey");
CREATE INDEX "AgentDecision_missionId_idx" ON "AgentDecision"("missionId");
CREATE INDEX "AgentDecision_proposedByAgentId_idx" ON "AgentDecision"("proposedByAgentId");
CREATE INDEX "AgentDecision_status_idx" ON "AgentDecision"("status");

ALTER TABLE "AgentTeam" ADD CONSTRAINT "AgentTeam_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "OrganizationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AgentTeamMember" ADD CONSTRAINT "AgentTeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "AgentTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgentTeamMember" ADD CONSTRAINT "AgentTeamMember_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgentMission" ADD CONSTRAINT "AgentMission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "AgentTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AgentMissionAssignment" ADD CONSTRAINT "AgentMissionAssignment_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "AgentMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgentMissionAssignment" ADD CONSTRAINT "AgentMissionAssignment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgentDecision" ADD CONSTRAINT "AgentDecision_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "AgentMission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AgentDecision" ADD CONSTRAINT "AgentDecision_proposedByAgentId_fkey" FOREIGN KEY ("proposedByAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
