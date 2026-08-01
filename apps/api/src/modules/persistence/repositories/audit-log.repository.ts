import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditLogRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    data: Prisma.AuditLogCreateInput,
  ) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  findById(
    id: string,
  ) {
    return this.prisma.auditLog.findUnique({
      where: {
        id,
      },
    });
  }

  findFirst(
    where: Prisma.AuditLogWhereInput,
  ) {
    return this.prisma.auditLog.findFirst({
      where,
    });
  }

  findMany(
    where: Prisma.AuditLogWhereInput = {},
  ) {
    return this.prisma.auditLog.findMany({
      where,
    });
  }

  count(
    where: Prisma.AuditLogWhereInput = {},
  ) {
    return this.prisma.auditLog.count({
      where,
    });
  }

  update(
    id: string,
    data: Prisma.AuditLogUpdateInput,
  ) {
    return this.prisma.auditLog.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(
    id: string,
  ) {
    return this.prisma.auditLog.delete({
      where: {
        id,
      },
    });
  }
}