import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class KnowledgeNodeRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.KnowledgeNodeCreateInput,
  ) {
    return this.prisma.knowledgeNode.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.knowledgeNode.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.KnowledgeNodeWhereInput,
  ) {
    return this.prisma.knowledgeNode.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.KnowledgeNodeWhereInput = {},
  ) {
    return this.prisma.knowledgeNode.findMany({
      where,
    });
  }

  count(
    where: Prisma.KnowledgeNodeWhereInput = {},
  ) {
    return this.prisma.knowledgeNode.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.KnowledgeNodeUpdateInput,
  ) {
    return this.prisma.knowledgeNode.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.knowledgeNode.delete({
      where: {
        id,
      },
    });
  }
}