import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApprovalGateRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.ApprovalGateCreateInput,
  ) {
    return this.prisma.approvalGate.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.approvalGate.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.ApprovalGateWhereInput,
  ) {
    return this.prisma.approvalGate.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.ApprovalGateWhereInput = {},
  ) {
    return this.prisma.approvalGate.findMany({
      where,
    });
  }

  count(
    where: Prisma.ApprovalGateWhereInput = {},
  ) {
    return this.prisma.approvalGate.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.ApprovalGateUpdateInput,
  ) {
    return this.prisma.approvalGate.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.approvalGate.delete({
      where: {
        id,
      },
    });
  }
}