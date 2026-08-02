CREATE TYPE "GovernancePolicyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'RETIRED');
CREATE TYPE "GovernanceDecisionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'SUPERSEDED');
CREATE TYPE "GovernanceRiskStatus" AS ENUM ('OPEN', 'MITIGATING', 'ACCEPTED', 'CLOSED');
CREATE TYPE "GovernanceRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "GovernanceComplianceStatus" AS ENUM ('NOT_ASSESSED', 'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', 'EXEMPTED');
CREATE TYPE "GovernanceChangeStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'CANCELLED');

CREATE TABLE "GovernancePolicy" (
  "id" TEXT NOT NULL,
  "policyKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" "GovernancePolicyStatus" NOT NULL DEFAULT 'DRAFT',
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

CREATE TABLE "GovernanceDecision" (
  "id" TEXT NOT NULL,
  "decisionKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "context" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "consequences" TEXT,
  "alternatives" JSONB,
  "status" "GovernanceDecisionStatus" NOT NULL DEFAULT 'PROPOSED',
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

CREATE TABLE "GovernanceRisk" (
  "id" TEXT NOT NULL,
  "riskKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "likelihood" INTEGER NOT NULL,
  "impact" INTEGER NOT NULL,
  "score" INTEGER NOT NULL,
  "level" "GovernanceRiskLevel" NOT NULL,
  "status" "GovernanceRiskStatus" NOT NULL DEFAULT 'OPEN',
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

CREATE TABLE "GovernanceComplianceRule" (
  "id" TEXT NOT NULL,
  "ruleKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "framework" TEXT NOT NULL,
  "control" TEXT NOT NULL,
  "severity" "GovernanceRiskLevel" NOT NULL DEFAULT 'MEDIUM',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "evidence" JSONB,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GovernanceComplianceRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GovernanceAssessment" (
  "id" TEXT NOT NULL,
  "policyId" TEXT,
  "riskId" TEXT,
  "ruleId" TEXT,
  "subjectType" TEXT NOT NULL,
  "subjectId" TEXT,
  "status" "GovernanceComplianceStatus" NOT NULL DEFAULT 'NOT_ASSESSED',
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

CREATE TABLE "GovernanceChangeRequest" (
  "id" TEXT NOT NULL,
  "changeKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "rationale" TEXT NOT NULL,
  "impactAnalysis" JSONB NOT NULL,
  "rollbackPlan" TEXT,
  "status" "GovernanceChangeStatus" NOT NULL DEFAULT 'DRAFT',
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

CREATE UNIQUE INDEX "GovernancePolicy_policyKey_key" ON "GovernancePolicy"("policyKey");
CREATE INDEX "GovernancePolicy_status_idx" ON "GovernancePolicy"("status");
CREATE INDEX "GovernancePolicy_category_idx" ON "GovernancePolicy"("category");
CREATE UNIQUE INDEX "GovernanceDecision_decisionKey_key" ON "GovernanceDecision"("decisionKey");
CREATE INDEX "GovernanceDecision_status_idx" ON "GovernanceDecision"("status");
CREATE INDEX "GovernanceDecision_decisionType_idx" ON "GovernanceDecision"("decisionType");
CREATE UNIQUE INDEX "GovernanceRisk_riskKey_key" ON "GovernanceRisk"("riskKey");
CREATE INDEX "GovernanceRisk_status_idx" ON "GovernanceRisk"("status");
CREATE INDEX "GovernanceRisk_level_idx" ON "GovernanceRisk"("level");
CREATE INDEX "GovernanceRisk_category_idx" ON "GovernanceRisk"("category");
CREATE UNIQUE INDEX "GovernanceComplianceRule_ruleKey_key" ON "GovernanceComplianceRule"("ruleKey");
CREATE INDEX "GovernanceComplianceRule_framework_idx" ON "GovernanceComplianceRule"("framework");
CREATE INDEX "GovernanceComplianceRule_active_idx" ON "GovernanceComplianceRule"("active");
CREATE INDEX "GovernanceAssessment_status_idx" ON "GovernanceAssessment"("status");
CREATE INDEX "GovernanceAssessment_subjectType_subjectId_idx" ON "GovernanceAssessment"("subjectType", "subjectId");
CREATE INDEX "GovernanceAssessment_policyId_idx" ON "GovernanceAssessment"("policyId");
CREATE INDEX "GovernanceAssessment_riskId_idx" ON "GovernanceAssessment"("riskId");
CREATE INDEX "GovernanceAssessment_ruleId_idx" ON "GovernanceAssessment"("ruleId");
CREATE UNIQUE INDEX "GovernanceChangeRequest_changeKey_key" ON "GovernanceChangeRequest"("changeKey");
CREATE INDEX "GovernanceChangeRequest_status_idx" ON "GovernanceChangeRequest"("status");

ALTER TABLE "GovernanceAssessment" ADD CONSTRAINT "GovernanceAssessment_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "GovernancePolicy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GovernanceAssessment" ADD CONSTRAINT "GovernanceAssessment_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "GovernanceRisk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GovernanceAssessment" ADD CONSTRAINT "GovernanceAssessment_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "GovernanceComplianceRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
