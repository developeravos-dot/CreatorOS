import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const policy = await prisma.governancePolicy.upsert({
    where: { policyKey: 'human-final-authority' },
    update: {},
    create: {
      policyKey: 'human-final-authority',
      name: 'Human Final Authority',
      description: 'Strategic, irreversible, high-risk, and constitutional decisions require explicit human approval.',
      category: 'GOVERNANCE',
      status: 'ACTIVE',
      rules: {
        strategicChangesRequireApproval: true,
        irreversibleActionsRequireApproval: true,
        constitutionalChangesRequireApproval: true,
        autonomousAgentsMayOnlyPropose: true,
      },
      owner: 'CreatorOS Governance',
      effectiveAt: new Date(),
      metadata: { seededBy: 'mega-pack-8', constitutional: true },
    },
  });

  await prisma.governanceComplianceRule.upsert({
    where: { ruleKey: 'human-approval-gate' },
    update: {},
    create: {
      ruleKey: 'human-approval-gate',
      name: 'Human approval gate',
      description: 'Blocks protected decisions and changes until an authorized human approves them.',
      framework: 'CREATOROS_CONSTITUTION',
      control: 'HUMAN_FINAL_AUTHORITY',
      severity: 'CRITICAL',
      active: true,
      evidence: { policyKey: policy.policyKey },
      metadata: { seededBy: 'mega-pack-8' },
    },
  });

  await prisma.governanceRisk.upsert({
    where: { riskKey: 'autonomous-strategic-action' },
    update: {},
    create: {
      riskKey: 'autonomous-strategic-action',
      title: 'Unauthorized autonomous strategic action',
      description: 'An autonomous system performs a strategic or irreversible action without human authorization.',
      category: 'AI_GOVERNANCE',
      likelihood: 2,
      impact: 5,
      score: 10,
      level: 'MEDIUM',
      status: 'MITIGATING',
      owner: 'CreatorOS Governance',
      mitigationPlan: 'Enforce approval gates, permissions, audit logs, and policy checks.',
      contingencyPlan: 'Suspend automation, roll back the action where possible, and initiate governance review.',
      metadata: { seededBy: 'mega-pack-8' },
    },
  });

  await prisma.governanceDecision.upsert({
    where: { decisionKey: 'governance-system-activation' },
    update: {},
    create: {
      decisionKey: 'governance-system-activation',
      title: 'Activate CreatorOS Enterprise Governance',
      context: 'CreatorOS requires a unified governance, risk, compliance, decision, and controlled-change layer.',
      decision: 'Activate the Enterprise Governance capability with Human Final Authority.',
      consequences: 'Protected decisions and changes remain proposals until explicitly reviewed.',
      alternatives: [
        'Allow unrestricted autonomous strategic execution',
        'Use disconnected manual governance records',
      ],
      status: 'PROPOSED',
      decisionType: 'ADR',
      owner: 'CreatorOS Governance',
      metadata: { seededBy: 'mega-pack-8' },
    },
  });
}

main().finally(async () => prisma.$disconnect());
