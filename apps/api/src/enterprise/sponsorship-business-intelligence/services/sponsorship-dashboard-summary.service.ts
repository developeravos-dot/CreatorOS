import { Injectable } from "@nestjs/common";

import { SponsorCrmRepository } from "../repositories/sponsor-crm.repository";

@Injectable()
export class SponsorshipDashboardSummaryService {

  constructor(
    private readonly repository: SponsorCrmRepository,
  ) {}

  async summary() {

    return this.repository.getDashboardSummary();

  }

}
