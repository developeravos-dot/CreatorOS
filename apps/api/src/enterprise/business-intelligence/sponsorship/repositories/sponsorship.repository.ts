import { Injectable } from '@nestjs/common';
import {
  SponsorshipOpportunity,
  SponsorshipOpportunityStatus,
} from '../models/sponsorship.models';

@Injectable()
export class SponsorshipRepository {
  private readonly opportunities = new Map<
    string,
    SponsorshipOpportunity
  >();

  save(
    opportunity: SponsorshipOpportunity,
  ): SponsorshipOpportunity {
    this.opportunities.set(
      opportunity.opportunityId,
      opportunity,
    );

    return opportunity;
  }

  findAll(): SponsorshipOpportunity[] {
    return Array.from(this.opportunities.values()).sort(
      (left, right) => right.score - left.score,
    );
  }

  findById(
    opportunityId: string,
  ): SponsorshipOpportunity | undefined {
    return this.opportunities.get(opportunityId);
  }

  updateStatus(
    opportunityId: string,
    status: SponsorshipOpportunityStatus,
  ): SponsorshipOpportunity | undefined {
    const current = this.opportunities.get(opportunityId);

    if (!current) {
      return undefined;
    }

    const updated: SponsorshipOpportunity = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.opportunities.set(opportunityId, updated);

    return updated;
  }

  count(): number {
    return this.opportunities.size;
  }
}
