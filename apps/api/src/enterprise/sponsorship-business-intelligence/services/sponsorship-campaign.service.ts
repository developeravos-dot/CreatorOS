import { Injectable } from "@nestjs/common";

import { SponsorshipCampaignRepository } from "../repositories/sponsorship-campaign.repository";

@Injectable()
export class SponsorshipCampaignService {

  constructor(
    private readonly repository: SponsorshipCampaignRepository,
  ) {}

  async list() {

    return this.repository.findAll();

  }

}
