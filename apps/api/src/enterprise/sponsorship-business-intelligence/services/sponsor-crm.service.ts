import { Injectable } from "@nestjs/common";

import { SponsorCrmRepository } from "../repositories/sponsor-crm.repository";

@Injectable()
export class SponsorCrmService {

  constructor(
    private readonly repository: SponsorCrmRepository,
  ) {}

  async dashboard() {

    return this.repository.getDashboardSummary();

  }

  async pipeline() {

    return this.repository.getPipeline();

  }

}
