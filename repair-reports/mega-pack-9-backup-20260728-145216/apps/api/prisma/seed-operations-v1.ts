import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not configured.');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const permissionKeys = ['operations.read','operations.write','operations.dashboard.read','incidents.manage','deployments.manage'];
  for (const key of permissionKeys) await prisma.creatorPermission.upsert({ where: { key }, update: { description: key }, create: { key, description: key } });
  const admin = await prisma.creatorRole.findUnique({ where: { key: 'admin' } });
  if (admin) {
    const permissions = await prisma.creatorPermission.findMany({ where: { key: { in: permissionKeys } } });
    for (const permission of permissions) await prisma.creatorRolePermission.upsert({ where: { roleId_permissionId: { roleId: admin.id, permissionId: permission.id } }, update: {}, create: { roleId: admin.id, permissionId: permission.id } });
  }
  const service = await prisma.opsService.upsert({ where: { serviceKey: 'creatoros-api' }, update: {}, create: { serviceKey: 'creatoros-api', name: 'CreatorOS API', description: 'Core CreatorOS enterprise API.', owner: 'Platform Engineering' } });
  await prisma.opsRunbook.upsert({ where: { runbookKey: 'creatoros-api-recovery' }, update: {}, create: { runbookKey: 'creatoros-api-recovery', title: 'CreatorOS API Recovery', content: 'Validate database, migrations, environment, logs, and restart the API after approval.', serviceId: service.id, owner: 'Platform Engineering' } });
  await prisma.opsSla.upsert({ where: { serviceId: service.id }, update: {}, create: { serviceId: service.id, name: 'CreatorOS API Production SLA', targetAvailability: 99, responseMinutes: 15, resolutionMinutes: 240 } });
  console.log('CreatorOS Enterprise Operations seed completed.');
}
main().catch((e)=>{ console.error(e); process.exitCode=1; }).finally(()=>prisma.$disconnect());
