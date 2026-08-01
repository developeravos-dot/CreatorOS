import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExecutionPlanRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.ExecutionPlanCreateInput,
  ) {
    return this.prisma.executionPlan.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.executionPlan.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.ExecutionPlanWhereInput,
  ) {
    return this.prisma.executionPlan.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.ExecutionPlanWhereInput = {},
  ) {
    return this.prisma.executionPlan.findMany({
      where,
    });
  }

  count(
    where: Prisma.ExecutionPlanWhereInput = {},
  ) {
    return this.prisma.executionPlan.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.ExecutionPlanUpdateInput,
  ) {
    return this.prisma.executionPlan.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.executionPlan.delete({
      where: {
        id,
      },
    });
  }
}