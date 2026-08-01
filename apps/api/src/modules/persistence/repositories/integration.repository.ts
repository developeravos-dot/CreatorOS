import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IntegrationRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.IntegrationCreateInput,
  ) {
    return this.prisma.integration.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.integration.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.IntegrationWhereInput,
  ) {
    return this.prisma.integration.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.IntegrationWhereInput = {},
  ) {
    return this.prisma.integration.findMany({
      where,
    });
  }

  count(
    where: Prisma.IntegrationWhereInput = {},
  ) {
    return this.prisma.integration.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.IntegrationUpdateInput,
  ) {
    return this.prisma.integration.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.integration.delete({
      where: {
        id,
      },
    });
  }
}