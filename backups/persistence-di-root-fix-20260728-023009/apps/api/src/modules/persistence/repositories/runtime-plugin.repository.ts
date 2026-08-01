import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RuntimePluginRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.RuntimePluginCreateInput,
  ) {
    return this.prisma.runtimePlugin.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.runtimePlugin.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.RuntimePluginWhereInput,
  ) {
    return this.prisma.runtimePlugin.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.RuntimePluginWhereInput = {},
  ) {
    return this.prisma.runtimePlugin.findMany({
      where,
    });
  }

  count(
    where: Prisma.RuntimePluginWhereInput = {},
  ) {
    return this.prisma.runtimePlugin.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.RuntimePluginUpdateInput,
  ) {
    return this.prisma.runtimePlugin.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.runtimePlugin.delete({
      where: {
        id,
      },
    });
  }
}