import { Injectable } from '@nestjs/common';
import { AgentRepository } from '../../persistence/repositories';

@Injectable()
export class AgentApplicationService {
  constructor(
    private readonly agents: AgentRepository,
  ) {}

  create(
    data: Parameters<AgentRepository['create']>[0],
  ) {
    return this.agents.create(data);
  }

  getById(
    id: string,
  ) {
    return this.agents.findById(id);
  }

  list(
    where: Parameters<AgentRepository['findMany']>[0] = {},
  ) {
    return this.agents.findMany(where);
  }

  count(
    where: Parameters<AgentRepository['count']>[0] = {},
  ) {
    return this.agents.count(where);
  }

  update(
    id: string,
    data: Parameters<AgentRepository['update']>[1],
  ) {
    return this.agents.update(
      id,
      data,
    );
  }

  remove(
    id: string,
  ) {
    return this.agents.delete(id);
  }
}