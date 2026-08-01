import { Injectable } from '@nestjs/common';
import {
  SponsorProfile,
  SponsorshipChannelProfile,
} from '../models/sponsorship.models';

@Injectable()
export class SponsorshipPricingEngine {
  calculate(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
    opportunityScore: number,
  ): {
    recommendedPrice: number;
    minimumAcceptablePrice: number;
    maximumPotentialPrice: number;
    currency: string;
  } {
    const effectiveViews = Math.max(channel.averageViews, 1);

    const engagementMultiplier =
      1 + Math.max(channel.audience.engagementRate, 0) / 100;

    const qualityMultiplier =
      0.7 +
      Math.max(channel.contentQualityScore, 0) / 100 * 0.6;

    const safetyMultiplier =
      0.75 +
      Math.max(channel.brandSafetyScore, 0) / 100 * 0.5;

    const fitMultiplier =
      0.65 + Math.max(opportunityScore, 0) / 100 * 0.75;

    const baseCpm = 18;

    const marketValue =
      (effectiveViews / 1000) *
      baseCpm *
      engagementMultiplier *
      qualityMultiplier *
      safetyMultiplier *
      fitMultiplier;

    const sponsorMidpoint =
      (sponsor.estimatedBudgetMin +
        sponsor.estimatedBudgetMax) /
      2;

    const blendedValue =
      marketValue * 0.65 + sponsorMidpoint * 0.35;

    const recommendedPrice = this.roundMoney(
      this.limit(
        blendedValue,
        sponsor.estimatedBudgetMin,
        sponsor.estimatedBudgetMax,
      ),
    );

    const minimumAcceptablePrice = this.roundMoney(
      Math.max(
        sponsor.estimatedBudgetMin,
        recommendedPrice * 0.75,
      ),
    );

    const maximumPotentialPrice = this.roundMoney(
      Math.min(
        sponsor.estimatedBudgetMax,
        recommendedPrice * 1.35,
      ),
    );

    return {
      recommendedPrice,
      minimumAcceptablePrice,
      maximumPotentialPrice,
      currency: sponsor.currency,
    };
  }

  private limit(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    if (maximum < minimum) {
      return value;
    }

    return Math.max(minimum, Math.min(maximum, value));
  }

  private roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
