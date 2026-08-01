import { Injectable } from '@nestjs/common';
import { CapabilityRepository } from '../../persistence/repositories';

@Injectable()
export class CapabilityApplicationService {
  constructor(
    private readonly capabilities: CapabilityRepository,
  ) {}

  create(
    data: Parameters<CapabilityRepository['create']>[0],
  ) {
    return this.capabilities.create(data);
  }

  getById(
    id: string,
  ) {
    return this.capabilities.findById(id);
  }

  findFirst(
    where: Parameters<CapabilityRepository['findFirst']>[0],
  ) {
    return this.capabilities.findFirst(where);
  }

  list(
    where: Parameters<CapabilityRepository['findMany']>[0] = {},
  ) {
    return this.capabilities.findMany(where);
  }

  count(
    where: Parameters<CapabilityRepository['count']>[0] = {},
  ) {
    return this.capabilities.count(where);
  }

  update(
    id: string,
    data: Parameters<CapabilityRepository['update']>[1],
  ) {
    return this.capabilities.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.capabilities.delete(id);
  }
}