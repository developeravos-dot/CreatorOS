import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CapabilityRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.CapabilityCreateInput,
  ) {
    return this.prisma.capability.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.capability.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.CapabilityWhereInput,
  ) {
    return this.prisma.capability.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.CapabilityWhereInput = {},
  ) {
    return this.prisma.capability.findMany({
      where,
    });
  }

  count(
    where: Prisma.CapabilityWhereInput = {},
  ) {
    return this.prisma.capability.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.CapabilityUpdateInput,
  ) {
    return this.prisma.capability.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.capability.delete({
      where: {
        id,
      },
    });
  }
}