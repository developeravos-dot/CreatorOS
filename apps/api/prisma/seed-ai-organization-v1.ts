import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const unit = await prisma.organizationUnit.upsert({
    where: { unitKey: 'ai-organization-core' },
    update: {},
    create: { unitKey: 'ai-organization-core', name: 'AI Organization Core', type: 'AI_ORGANIZATION', purpose: 'Coordinate specialist AI agents under human final authority.', metadata: { seededBy: 'mega-pack-7' } },
  });

  const strategist = await prisma.agent.upsert({
    where: { agentKey: 'strategy-orchestrator' },
    update: { organizationUnitId: unit.id },
    create: { agentKey: 'strategy-orchestrator', organizationUnitId: unit.id, name: 'Strategy Orchestrator', role: 'ORCHESTRATOR', instructions: { mandate: 'Coordinate specialist agents and preserve governance gates.' }, capabilities: ['planning', 'delegation', 'synthesis'], memoryConfig: { knowledgeIntelligence: true }, metadata: { seededBy: 'mega-pack-7' } },
  });

  const team = await prisma.agentTeam.upsert({
    where: { teamKey: 'creatoros-core-team' },
    update: { organizationUnitId: unit.id },
    create: { teamKey: 'creatoros-core-team', organizationUnitId: unit.id, name: 'CreatorOS Core AI Team', purpose: 'Coordinate CreatorOS planning and implementation.', status: 'ACTIVE', operatingModel: { orchestration: 'hierarchical-collaborative', humanFinalAuthority: true }, metadata: { seededBy: 'mega-pack-7' } },
  });

  await prisma.agentTeamMember.upsert({
    where: { teamId_agentId: { teamId: team.id, agentId: strategist.id } },
    update: {},
    create: { teamId: team.id, agentId: strategist.id, role: 'LEAD_ORCHESTRATOR', priority: 100, responsibilities: { planning: true, delegation: true, synthesis: true } },
  });

  const mission = await prisma.agentMission.upsert({
    where: { missionKey: 'validate-human-final-authority' },
    update: {},
    create: { missionKey: 'validate-human-final-authority', teamId: team.id, title: 'Validate Human Final Authority', description: 'Verify that strategic AI decisions remain proposed until human review.', priority: 'CRITICAL', status: 'QUEUED', objective: { governanceGate: true }, requiredCapabilities: ['governance', 'risk-analysis'], constraints: { irreversibleActionsRequireApproval: true }, metadata: { seededBy: 'mega-pack-7' } },
  });

  await prisma.agentMissionAssignment.upsert({
    where: { missionId_agentId: { missionId: mission.id, agentId: strategist.id } },
    update: {},
    create: { missionId: mission.id, agentId: strategist.id, assignmentRole: 'MISSION_LEAD', instructions: { produceProposalOnly: true } },
  });

  await prisma.agentDecision.upsert({
    where: { decisionKey: 'human-final-authority-required' },
    update: {},
    create: { decisionKey: 'human-final-authority-required', missionId: mission.id, proposedByAgentId: strategist.id, title: 'Require human approval for strategic AI decisions', summary: 'Strategic or irreversible decisions must not execute before explicit human approval.', options: { approve: true, reject: true }, recommendation: { action: 'APPROVE_GOVERNANCE_GATE' }, riskAssessment: { bypassRisk: 'CRITICAL' }, status: 'PROPOSED', metadata: { seededBy: 'mega-pack-7' } },
  });
}

main().finally(async () => prisma.$disconnect());
