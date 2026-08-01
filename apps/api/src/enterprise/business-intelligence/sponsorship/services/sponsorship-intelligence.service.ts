import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DiscoverSponsorshipsDto,
  SponsorProfileDto,
} from '../dto/sponsorship.dto';
import { SponsorshipMatchingEngine } from '../engines/sponsorship-matching.engine';
import { SponsorshipPricingEngine } from '../engines/sponsorship-pricing.engine';
import { SponsorshipStrategyEngine } from '../engines/sponsorship-strategy.engine';
import {
  SponsorProfile,
  SponsorshipChannelProfile,
  SponsorshipOpportunity,
  SponsorshipOpportunityStatus,
} from '../models/sponsorship.models';
import { SponsorshipRepository } from '../repositories/sponsorship.repository';

@Injectable()
export class SponsorshipIntelligenceService {
  constructor(
    private readonly matchingEngine: SponsorshipMatchingEngine,
    private readonly pricingEngine: SponsorshipPricingEngine,
    private readonly strategyEngine: SponsorshipStrategyEngine,
    private readonly repository: SponsorshipRepository,
  ) {}

  status() {
    return {
      success: true,
      system:
        'CreatorOS Sponsorship & Business Intelligence',
      megaPack: '1A',
      status: 'operational',
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      autonomousContracting: false,
      components: {
        sponsorshipDiscovery: true,
        sponsorChannelMatching: true,
        opportunityScoring: true,
        sponsorshipPricing: true,
        riskDetection: true,
        formatRecommendation: true,
        negotiationIntelligence: true,
        humanApprovalGate: true,
      },
      metrics: {
        storedOpportunities: this.repository.count(),
      },
    };
  }

  discover(
    input: DiscoverSponsorshipsDto,
  ): SponsorshipOpportunity[] {
    const channel =
      input.channel as SponsorshipChannelProfile;

    return input.sponsors
      .map((sponsorDto) =>
        this.createOpportunity(
          channel,
          sponsorDto as SponsorProfile,
        ),
      )
      .sort((left, right) => right.score - left.score);
  }

  analyzeSponsor(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): SponsorshipOpportunity {
    return this.createOpportunity(channel, sponsor);
  }

  list(): SponsorshipOpportunity[] {
    return this.repository.findAll();
  }

  get(
    opportunityId: string,
  ): SponsorshipOpportunity {
    const opportunity =
      this.repository.findById(opportunityId);

    if (!opportunity) {
      throw new NotFoundException(
        `Sponsorship opportunity ${opportunityId} was not found.`,
      );
    }

    return opportunity;
  }

  updateStatus(
    opportunityId: string,
    status: SponsorshipOpportunityStatus,
  ): SponsorshipOpportunity {
    const opportunity = this.repository.updateStatus(
      opportunityId,
      status,
    );

    if (!opportunity) {
      throw new NotFoundException(
        `Sponsorship opportunity ${opportunityId} was not found.`,
      );
    }

    return opportunity;
  }

  dashboard() {
    const opportunities = this.repository.findAll();

    const totalPotentialRevenue = opportunities.reduce(
      (sum, opportunity) =>
        sum + opportunity.recommendedPrice,
      0,
    );

    return {
      success: true,
      system:
        'CreatorOS Sponsorship & Business Intelligence',
      megaPack: '1A',
      summary: {
        totalOpportunities: opportunities.length,
        exceptionalMatches: opportunities.filter(
          (item) => item.fitLevel === 'exceptional',
        ).length,
        strongMatches: opportunities.filter(
          (item) => item.fitLevel === 'strong',
        ).length,
        criticalRisks: opportunities.filter(
          (item) => item.riskLevel === 'critical',
        ).length,
        totalPotentialRevenue:
          Math.round(totalPotentialRevenue * 100) / 100,
        currencies: Array.from(
          new Set(
            opportunities.map(
              (opportunity) => opportunity.currency,
            ),
          ),
        ),
      },
      topOpportunities: opportunities.slice(0, 10),
      humanFinalAuthority: true,
    };
  }

  private createOpportunity(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): SponsorshipOpportunity {
    const matching = this.matchingEngine.score(
      channel,
      sponsor,
    );

    const pricing = this.pricingEngine.calculate(
      channel,
      sponsor,
      matching.score,
    );

    const now = new Date().toISOString();

    const opportunity: SponsorshipOpportunity = {
      opportunityId: randomUUID(),
      sponsor,
      channel,
      status:
        matching.riskLevel === 'critical'
          ? 'rejected'
          : matching.score >= 70
            ? 'recommended'
            : 'qualified',
      fitLevel: matching.fitLevel,
      riskLevel: matching.riskLevel,
      score: matching.score,
      scoreBreakdown: matching.breakdown,
      recommendedPrice: pricing.recommendedPrice,
      minimumAcceptablePrice:
        pricing.minimumAcceptablePrice,
      maximumPotentialPrice:
        pricing.maximumPotentialPrice,
      currency: pricing.currency,
      recommendedFormats:
        this.strategyEngine.recommendFormats(channel),
      valueProposition:
        this.strategyEngine.buildValueProposition(
          channel,
          sponsor,
        ),
      risks: matching.risks,
      negotiationPoints:
        this.strategyEngine.buildNegotiationPoints(
          channel,
          sponsor,
          pricing.recommendedPrice,
        ),
      nextBestAction:
        this.strategyEngine.nextBestAction(
          matching.score,
          matching.riskLevel,
        ),
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.save(opportunity);
  }
}
