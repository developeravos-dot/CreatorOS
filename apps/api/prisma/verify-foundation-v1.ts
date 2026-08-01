import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
} from '../src/generated/prisma/client';

const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not configured.',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});

async function main() {
  const [
    capabilities,
    blueprints,
    versions,
    approvalGates,
  ] = await Promise.all([
    prisma.capability.count(),
    prisma.blueprint.count(),
    prisma.blueprintVersion.count(),
    prisma.approvalGate.count(),
  ]);

  const masterBlueprint =
    await prisma.blueprint.findUnique({
      where: {
        blueprintKey:
          'creatoros.master-blueprint',
      },
    });

  const result = {
    provider: 'PostgreSQL/Prisma',
    persistent: true,
    capabilities,
    blueprints,
    versions,
    approvalGates,
    masterBlueprint:
      masterBlueprint
        ? {
            id: masterBlueprint.id,
            key:
              masterBlueprint.blueprintKey,
            status:
              masterBlueprint.status,
          }
        : null,
  };

  if (
    capabilities < 9 ||
    !masterBlueprint ||
    versions < 1 ||
    approvalGates < 2
  ) {
    console.error(
      JSON.stringify(
        {
          success: false,
          ...result,
        },
        null,
        2,
      ),
    );

    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        ...result,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });