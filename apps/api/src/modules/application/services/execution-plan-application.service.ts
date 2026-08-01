import { Injectable } from '@nestjs/common';
import { ExecutionPlanRepository } from '../../persistence/repositories';

@Injectable()
export class ExecutionPlanApplicationService {
  constructor(
    private readonly plans: ExecutionPlanRepository,
  ) {}

  create(
    data: Parameters<ExecutionPlanRepository['create']>[0],
  ) {
    return this.plans.create(data);
  }

  getById(
    id: string,
  ) {
    return this.plans.findById(id);
  }

  list(
    where: Parameters<ExecutionPlanRepository['findMany']>[0] = {},
  ) {
    return this.plans.findMany(where);
  }

  count(
    where: Parameters<ExecutionPlanRepository['count']>[0] = {},
  ) {
    return this.plans.count(where);
  }

  update(
    id: string,
    data: Parameters<ExecutionPlanRepository['update']>[1],
  ) {
    return this.plans.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.plans.delete(id);
  }
}