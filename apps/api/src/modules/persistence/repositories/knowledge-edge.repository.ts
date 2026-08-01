import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class KnowledgeEdgeRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.KnowledgeEdgeCreateInput,
  ) {
    return this.prisma.knowledgeEdge.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.knowledgeEdge.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.KnowledgeEdgeWhereInput,
  ) {
    return this.prisma.knowledgeEdge.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.KnowledgeEdgeWhereInput = {},
  ) {
    return this.prisma.knowledgeEdge.findMany({
      where,
    });
  }

  count(
    where: Prisma.KnowledgeEdgeWhereInput = {},
  ) {
    return this.prisma.knowledgeEdge.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.KnowledgeEdgeUpdateInput,
  ) {
    return this.prisma.knowledgeEdge.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.knowledgeEdge.delete({
      where: {
        id,
      },
    });
  }
}