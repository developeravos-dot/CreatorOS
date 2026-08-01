import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationUnitRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.OrganizationUnitCreateInput,
  ) {
    return this.prisma.organizationUnit.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.organizationUnit.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.OrganizationUnitWhereInput,
  ) {
    return this.prisma.organizationUnit.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.OrganizationUnitWhereInput = {},
  ) {
    return this.prisma.organizationUnit.findMany({
      where,
    });
  }

  count(
    where: Prisma.OrganizationUnitWhereInput = {},
  ) {
    return this.prisma.organizationUnit.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.OrganizationUnitUpdateInput,
  ) {
    return this.prisma.organizationUnit.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.organizationUnit.delete({
      where: {
        id,
      },
    });
  }
}