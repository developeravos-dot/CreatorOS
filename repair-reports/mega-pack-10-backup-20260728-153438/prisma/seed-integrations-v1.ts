import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
async function main(){
  await prisma.integrationEventDefinition.upsert({where:{eventName:'creator.content.published'},update:{active:true},create:{eventName:'creator.content.published',domain:'content',version:'1.0.0',description:'Emitted when content is published.',schema:{type:'object',required:['contentId']}}});
  await prisma.integrationEventDefinition.upsert({where:{eventName:'creator.workflow.completed'},update:{active:true},create:{eventName:'creator.workflow.completed',domain:'workflow',version:'1.0.0',description:'Emitted when a workflow completes.',schema:{type:'object',required:['workflowId']}}});
  await prisma.integrationEndpoint.upsert({where:{endpointKey:'creatoros-internal-event-bus'},update:{status:'ACTIVE'},create:{endpointKey:'creatoros-internal-event-bus',name:'CreatorOS Internal Event Bus',type:'EVENT_BUS',description:'Canonical internal integration endpoint.',status:'ACTIVE',configuration:{transport:'database-outbox'}}});
  await prisma.integrationWebhook.upsert({where:{webhookKey:'creatoros-audit-webhook'},update:{active:false},create:{webhookKey:'creatoros-audit-webhook',name:'CreatorOS Audit Webhook',url:'http://localhost:3000/internal/audit-hook',eventNames:['creator.content.published'],active:false}});
  console.log('Integration & Events seed completed.');
}
main().finally(async()=>prisma.$disconnect());
