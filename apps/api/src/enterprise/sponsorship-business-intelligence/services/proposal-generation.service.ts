import { Injectable } from "@nestjs/common";

import { SponsorshipProposalRepository } from "../repositories/sponsorship-proposal.repository";

@Injectable()
export class ProposalGenerationService {

  constructor(
    private readonly repository: SponsorshipProposalRepository,
  ) {}

  async generate(
    dto: unknown,
  ) {

    return this.repository.create(dto);

  }

}
