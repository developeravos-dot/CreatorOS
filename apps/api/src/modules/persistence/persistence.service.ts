import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PersistenceService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getHealth() {
    const database =
      await this.prisma.isHealthy();

    return {
      name: 'CreatorOS Persistence',
      version: '4.1.0',
      status: database
        ? 'operational'
        : 'unavailable',
      database,
      provider: 'postgresql',
      orm: 'prisma',
      humanFinalAuthority: true,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
    };
  }

  getClient(): PrismaService {
    return this.prisma;
  }
}
