import { Injectable } from '@nestjs/common';
import { RuntimePluginRepository } from '../../persistence/repositories';

@Injectable()
export class RuntimePluginApplicationService {
  constructor(
    private readonly plugins: RuntimePluginRepository,
  ) {}

  create(
    data: Parameters<RuntimePluginRepository['create']>[0],
  ) {
    return this.plugins.create(data);
  }

  getById(
    id: string,
  ) {
    return this.plugins.findById(id);
  }

  list(
    where: Parameters<RuntimePluginRepository['findMany']>[0] = {},
  ) {
    return this.plugins.findMany(where);
  }

  count(
    where: Parameters<RuntimePluginRepository['count']>[0] = {},
  ) {
    return this.plugins.count(where);
  }

  update(
    id: string,
    data: Parameters<RuntimePluginRepository['update']>[1],
  ) {
    return this.plugins.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.plugins.delete(id);
  }
}