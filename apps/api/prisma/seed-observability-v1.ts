import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const rule = await prisma.obsAlertRule.upsert({
    where: { ruleKey: 'creatoros-api-high-error-rate' },
    update: {
      name: 'CreatorOS API high error rate',
      metricKey: 'http.server.errors.rate',
      operator: '>',
      threshold: 5,
      severity: 'HIGH',
      evaluationWindowMinutes: 5,
      enabled: true,
      labels: { service: 'creatoros-api', source: 'mega-pack-12' },
    },
    create: {
      ruleKey: 'creatoros-api-high-error-rate',
      name: 'CreatorOS API high error rate',
      metricKey: 'http.server.errors.rate',
      operator: '>',
      threshold: 5,
      severity: 'HIGH',
      evaluationWindowMinutes: 5,
      enabled: true,
      labels: { service: 'creatoros-api', source: 'mega-pack-12' },
    },
  });

  await prisma.obsMetric.create({
    data: {
      metricKey: 'creatoros.bootstrap.ready',
      service: 'creatoros-api',
      kind: 'GAUGE',
      value: 1,
      unit: 'boolean',
      labels: { source: 'mega-pack-12' },
    },
  });

  await prisma.obsHealthCheck.create({
    data: {
      service: 'creatoros-api',
      status: 'HEALTHY',
      latencyMs: 0,
      message: 'Mega Pack 12 observability baseline initialized.',
      details: { source: 'mega-pack-12' },
    },
  });

  await prisma.obsLogEntry.create({
    data: {
      service: 'creatoros-api',
      level: 'INFO',
      message: 'Mega Pack 12 observability baseline initialized.',
      context: { source: 'mega-pack-12' },
    },
  });

  await prisma.obsTraceSpan.upsert({
    where: { spanId: 'mega-pack-12-bootstrap-span' },
    update: {
      status: 'OK',
      durationMs: 1,
      attributes: { source: 'mega-pack-12' },
    },
    create: {
      traceId: 'mega-pack-12-bootstrap-trace',
      spanId: 'mega-pack-12-bootstrap-span',
      service: 'creatoros-api',
      operation: 'observability.bootstrap',
      status: 'OK',
      durationMs: 1,
      attributes: { source: 'mega-pack-12' },
    },
  });

  await prisma.obsAlertEvent.upsert({
    where: { fingerprint: 'mega-pack-12-baseline-alert' },
    update: {
      ruleId: rule.id,
      title: 'Observability baseline active',
      message: 'Mega Pack 12 alerting pipeline is initialized.',
      severity: 'INFO',
      status: 'RESOLVED',
      service: 'creatoros-api',
      currentValue: 0,
      resolvedAt: new Date(),
      metadata: { source: 'mega-pack-12' },
    },
    create: {
      ruleId: rule.id,
      fingerprint: 'mega-pack-12-baseline-alert',
      title: 'Observability baseline active',
      message: 'Mega Pack 12 alerting pipeline is initialized.',
      severity: 'INFO',
      status: 'RESOLVED',
      service: 'creatoros-api',
      currentValue: 0,
      resolvedAt: new Date(),
      metadata: { source: 'mega-pack-12' },
    },
  });

  console.log('Mega Pack 12 Observability & Telemetry seed completed.');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
