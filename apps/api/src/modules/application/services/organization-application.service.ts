import { Injectable } from '@nestjs/common';
import { OrganizationUnitRepository } from '../../persistence/repositories';

@Injectable()
export class OrganizationApplicationService {
  constructor(
    private readonly units: OrganizationUnitRepository,
  ) {}

  createUnit(
    data: Parameters<OrganizationUnitRepository['create']>[0],
  ) {
    return this.units.create(data);
  }

  getUnit(
    id: string,
  ) {
    return this.units.findById(id);
  }

  listUnits(
    where: Parameters<OrganizationUnitRepository['findMany']>[0] = {},
  ) {
    return this.units.findMany(where);
  }

  countUnits(
    where: Parameters<OrganizationUnitRepository['count']>[0] = {},
  ) {
    return this.units.count(where);
  }

  updateUnit(
    id: string,
    data: Parameters<OrganizationUnitRepository['update']>[1],
  ) {
    return this.units.update(
      id,
      data,
    );
  }

  removeUnit(
    id: string,
  ) {
    return this.units.delete(id);
  }
}