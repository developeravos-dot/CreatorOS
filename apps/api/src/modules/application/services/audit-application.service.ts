import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from '../../persistence/repositories';

@Injectable()
export class AuditApplicationService {
  constructor(
    private readonly auditLogs: AuditLogRepository,
  ) {}

  record(
    data: Parameters<AuditLogRepository['create']>[0],
  ) {
    return this.auditLogs.create(data);
  }

  getById(
    id: string,
  ) {
    return this.auditLogs.findById(id);
  }

  list(
    where: Parameters<AuditLogRepository['findMany']>[0] = {},
  ) {
    return this.auditLogs.findMany(where);
  }

  count(
    where: Parameters<AuditLogRepository['count']>[0] = {},
  ) {
    return this.auditLogs.count(where);
  }

  remove(
    id: string,
  ) {
    return this.auditLogs.delete(id);
  }
}