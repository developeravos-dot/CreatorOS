import { Injectable } from '@nestjs/common';
import { IntegrationRepository } from '../../persistence/repositories';

@Injectable()
export class IntegrationApplicationService {
  constructor(
    private readonly integrations: IntegrationRepository,
  ) {}

  create(
    data: Parameters<IntegrationRepository['create']>[0],
  ) {
    return this.integrations.create(data);
  }

  getById(
    id: string,
  ) {
    return this.integrations.findById(id);
  }

  list(
    where: Parameters<IntegrationRepository['findMany']>[0] = {},
  ) {
    return this.integrations.findMany(where);
  }

  count(
    where: Parameters<IntegrationRepository['count']>[0] = {},
  ) {
    return this.integrations.count(where);
  }

  update(
    id: string,
    data: Parameters<IntegrationRepository['update']>[1],
  ) {
    return this.integrations.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.integrations.delete(id);
  }
}