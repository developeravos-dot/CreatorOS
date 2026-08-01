import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence';

@Injectable()
export class CapabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const capabilities = await this.prisma.capability.findMany({
      orderBy: [{ domain: 'asc' }, { capabilityKey: 'asc' }],
    });

    return {
      registry: 'capability-registry',
      status: 'operational',
      count: capabilities.length,
      capabilities: capabilities.map((item) => ({
        id: item.id,
        key: item.capabilityKey,
        capabilityKey: item.capabilityKey,
        name: item.name,
        domain: item.domain,
        description: item.description,
        status: item.status.toLowerCase(),
        contract: item.contract,
        dependencies: item.dependencies,
        metadata: item.metadata,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      provider: 'PostgreSQL/Prisma',
    };
  }

  async getById(id: string) {
    const item = await this.prisma.capability.findFirst({
      where: { OR: [{ id }, { capabilityKey: id }] },
    });

    if (!item) return undefined;

    return {
      id: item.id,
      key: item.capabilityKey,
      capabilityKey: item.capabilityKey,
      name: item.name,
      domain: item.domain,
      description: item.description,
      status: item.status.toLowerCase(),
      contract: item.contract,
      dependencies: item.dependencies,
      metadata: item.metadata,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}