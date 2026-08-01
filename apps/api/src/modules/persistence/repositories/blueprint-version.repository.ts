import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlueprintVersionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.BlueprintVersionCreateInput,
  ) {
    return this.prisma.blueprintVersion.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.blueprintVersion.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.BlueprintVersionWhereInput,
  ) {
    return this.prisma.blueprintVersion.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.BlueprintVersionWhereInput = {},
  ) {
    return this.prisma.blueprintVersion.findMany({
      where,
    });
  }

  count(
    where: Prisma.BlueprintVersionWhereInput = {},
  ) {
    return this.prisma.blueprintVersion.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.BlueprintVersionUpdateInput,
  ) {
    return this.prisma.blueprintVersion.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.blueprintVersion.delete({
      where: {
        id,
      },
    });
  }
}