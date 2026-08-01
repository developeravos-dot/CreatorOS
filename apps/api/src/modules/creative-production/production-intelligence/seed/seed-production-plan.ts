import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  const plan = await prisma.productionPlan.create({
    data: {
      title: "CreatorOS Production Intelligence Foundation",
      category: "CREATIVE_PRODUCTION",
      genre: "FOUNDATION",
      language: "en",
      platform: "CREATOR_OS",
      strategy: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },
      audience: {
        primary: "CreatorOS",
        scope: "enterprise",
      },
      content: {
        status: "initialized",
        module: "production-intelligence",
      },
    },
  });

  console.log("Production plan created:", plan);
}

main()
  .catch((error: unknown) => {
    console.error("Production plan seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });