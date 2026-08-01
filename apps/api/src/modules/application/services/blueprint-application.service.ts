import { Injectable } from '@nestjs/common';
import {
  BlueprintRepository,
  BlueprintVersionRepository,
} from '../../persistence/repositories';

@Injectable()
export class BlueprintApplicationService {
  constructor(
    private readonly blueprints: BlueprintRepository,
    private readonly versions: BlueprintVersionRepository,
  ) {}

  create(
    data: Parameters<BlueprintRepository['create']>[0],
  ) {
    return this.blueprints.create(data);
  }

  getById(
    id: string,
  ) {
    return this.blueprints.findById(id);
  }

  list(
    where: Parameters<BlueprintRepository['findMany']>[0] = {},
  ) {
    return this.blueprints.findMany(where);
  }

  update(
    id: string,
    data: Parameters<BlueprintRepository['update']>[1],
  ) {
    return this.blueprints.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.blueprints.delete(id);
  }

  createVersion(
    data: Parameters<BlueprintVersionRepository['create']>[0],
  ) {
    return this.versions.create(data);
  }

  listVersions(
    where: Parameters<BlueprintVersionRepository['findMany']>[0] = {},
  ) {
    return this.versions.findMany(where);
  }
}