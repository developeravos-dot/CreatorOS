import { Injectable } from '@nestjs/common';
import { ApprovalGateRepository } from '../../persistence/repositories';

@Injectable()
export class ApprovalApplicationService {
  constructor(
    private readonly approvals: ApprovalGateRepository,
  ) {}

  create(
    data: Parameters<ApprovalGateRepository['create']>[0],
  ) {
    return this.approvals.create(data);
  }

  getById(
    id: string,
  ) {
    return this.approvals.findById(id);
  }

  list(
    where: Parameters<ApprovalGateRepository['findMany']>[0] = {},
  ) {
    return this.approvals.findMany(where);
  }

  count(
    where: Parameters<ApprovalGateRepository['count']>[0] = {},
  ) {
    return this.approvals.count(where);
  }

  update(
    id: string,
    data: Parameters<ApprovalGateRepository['update']>[1],
  ) {
    return this.approvals.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.approvals.delete(id);
  }
}