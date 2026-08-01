require("dotenv").config();

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./dist/generated/prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const p = new PrismaClient({
  adapter,
});

p.mediaResearch.count()
  .then(console.log)
  .catch(console.error)
  .finally(() => p.$disconnect());
