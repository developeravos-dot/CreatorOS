import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlueprintRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.BlueprintCreateInput,
  ) {
    return this.prisma.blueprint.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.blueprint.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.BlueprintWhereInput,
  ) {
    return this.prisma.blueprint.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.BlueprintWhereInput = {},
  ) {
    return this.prisma.blueprint.findMany({
      where,
    });
  }

  count(
    where: Prisma.BlueprintWhereInput = {},
  ) {
    return this.prisma.blueprint.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.BlueprintUpdateInput,
  ) {
    return this.prisma.blueprint.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.blueprint.delete({
      where: {
        id,
      },
    });
  }
}