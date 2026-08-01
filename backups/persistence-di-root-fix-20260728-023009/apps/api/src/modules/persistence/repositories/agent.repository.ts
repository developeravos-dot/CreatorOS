import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AgentRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.AgentCreateInput,
  ) {
    return this.prisma.agent.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.agent.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.AgentWhereInput,
  ) {
    return this.prisma.agent.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.AgentWhereInput = {},
  ) {
    return this.prisma.agent.findMany({
      where,
    });
  }

  count(
    where: Prisma.AgentWhereInput = {},
  ) {
    return this.prisma.agent.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.AgentUpdateInput,
  ) {
    return this.prisma.agent.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.agent.delete({
      where: {
        id,
      },
    });
  }
}