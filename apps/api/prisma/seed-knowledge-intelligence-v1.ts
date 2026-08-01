import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const source = await prisma.knowledgeSource.upsert({
    where: { sourceKey: 'creatoros-constitution' },
    update: {},
    create: { sourceKey: 'creatoros-constitution', name: 'CreatorOS Constitution', type: 'DOCUMENT', uri: 'constitution/AVOS-CONSTITUTION.md', metadata: { authority: 'highest', humanFinalAuthority: true } },
  });
  const node = await prisma.knowledgeNode.upsert({
    where: { nodeKey: 'principle-human-final-authority' },
    update: {},
    create: { nodeKey: 'principle-human-final-authority', type: 'PRINCIPLE', name: 'Human Final Authority', description: 'Strategic and irreversible decisions require human approval.', properties: { constitutional: true } },
  });
  await prisma.knowledgeEvidence.create({ data: { nodeId: node.id, sourceId: source.id, claim: 'Human Final Authority is mandatory for strategic decisions.', confidence: 'VERIFIED', score: 1, context: { seededBy: 'mega-pack-6' }, observedAt: new Date() } });
  await prisma.knowledgeInsight.upsert({
    where: { insightKey: 'human-authority-governance-gate' },
    update: {},
    create: { insightKey: 'human-authority-governance-gate', title: 'Human authority governance gate', summary: 'Autonomous recommendations must remain proposed until a human approves or rejects them.', category: 'GOVERNANCE', confidence: 'VERIFIED', score: 1, status: 'PROPOSED', nodeId: node.id, evidenceIds: [], recommendations: ['Require explicit review for strategic changes'], metadata: { seededBy: 'mega-pack-6' } },
  });
}

main().finally(async () => prisma.$disconnect());
