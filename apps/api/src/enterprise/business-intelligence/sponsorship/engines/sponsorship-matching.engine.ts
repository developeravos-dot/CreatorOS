import { Injectable } from '@nestjs/common';
import {
  SponsorProfile,
  SponsorshipChannelProfile,
  SponsorshipFitLevel,
  SponsorshipRiskLevel,
  SponsorshipScoreBreakdown,
} from '../models/sponsorship.models';

@Injectable()
export class SponsorshipMatchingEngine {
  score(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): {
    score: number;
    fitLevel: SponsorshipFitLevel;
    riskLevel: SponsorshipRiskLevel;
    breakdown: SponsorshipScoreBreakdown;
    risks: string[];
  } {
    const breakdown: SponsorshipScoreBreakdown = {
      audienceMatch: this.average([
        this.overlapScore(
          channel.audience.interests,
          sponsor.targetInterests,
        ),
        this.overlapScore(
          channel.audience.ageRanges,
          sponsor.targetAgeRanges,
        ),
        this.overlapScore(
          channel.audience.languages,
          sponsor.targetLanguages,
        ),
      ]),
      categoryMatch: this.overlapScore(
        channel.categories,
        sponsor.preferredContentCategories.length > 0
          ? sponsor.preferredContentCategories
          : sponsor.industries,
      ),
      geographyMatch: this.overlapScore(
        channel.audience.countries,
        sponsor.targetCountries,
      ),
      platformMatch: this.overlapScore(
        channel.platforms,
        sponsor.preferredPlatforms,
      ),
      engagementQuality: this.clamp(
        channel.audience.engagementRate * 12.5,
      ),
      brandSafety: this.clamp(channel.brandSafetyScore),
      budgetCompatibility: this.calculateBudgetCompatibility(
        channel,
        sponsor,
      ),
      contentQuality: this.clamp(channel.contentQualityScore),
      strategicValue: this.calculateStrategicValue(channel, sponsor),
    };

    const score = Math.round(
      breakdown.audienceMatch * 0.18 +
        breakdown.categoryMatch * 0.16 +
        breakdown.geographyMatch * 0.1 +
        breakdown.platformMatch * 0.08 +
        breakdown.engagementQuality * 0.12 +
        breakdown.brandSafety * 0.13 +
        breakdown.budgetCompatibility * 0.08 +
        breakdown.contentQuality * 0.1 +
        breakdown.strategicValue * 0.05,
    );

    const risks = this.detectRisks(channel, sponsor);
    const riskLevel = this.resolveRiskLevel(risks, channel);
    const fitLevel = this.resolveFitLevel(score);

    return {
      score,
      fitLevel,
      riskLevel,
      breakdown,
      risks,
    };
  }

  private calculateBudgetCompatibility(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): number {
    const estimatedBaseValue =
      Math.max(channel.averageViews, 1) *
      Math.max(channel.audience.engagementRate / 100, 0.01) *
      0.12;

    if (
      estimatedBaseValue >= sponsor.estimatedBudgetMin &&
      estimatedBaseValue <= sponsor.estimatedBudgetMax
    ) {
      return 100;
    }

    if (estimatedBaseValue < sponsor.estimatedBudgetMin) {
      const difference =
        sponsor.estimatedBudgetMin - estimatedBaseValue;

      return this.clamp(
        100 -
          (difference /
            Math.max(sponsor.estimatedBudgetMin, 1)) *
            70,
      );
    }

    const difference =
      estimatedBaseValue - sponsor.estimatedBudgetMax;

    return this.clamp(
      100 -
        (difference /
          Math.max(sponsor.estimatedBudgetMax, 1)) *
          80,
    );
  }

  private calculateStrategicValue(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): number {
    const reachScore = this.clamp(
      Math.log10(Math.max(channel.audience.estimatedReach, 10)) * 20,
    );

    const frequencyScore = this.clamp(
      channel.publishingFrequencyPerMonth * 8,
    );

    const sponsorBreadthScore = this.clamp(
      sponsor.targetCountries.length * 10 +
        sponsor.preferredPlatforms.length * 10,
    );

    return this.average([
      reachScore,
      frequencyScore,
      sponsorBreadthScore,
    ]);
  }

  private detectRisks(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): string[] {
    const risks: string[] = [];

    if (channel.brandSafetyScore < 60) {
      risks.push('Channel brand-safety score is below the recommended level.');
    }

    if (channel.contentQualityScore < 60) {
      risks.push('Channel content-quality score requires improvement.');
    }

    if (
      this.overlapScore(
        channel.audience.countries,
        sponsor.targetCountries,
      ) < 30
    ) {
      risks.push('Weak geographic audience alignment.');
    }

    if (
      this.overlapScore(
        channel.platforms,
        sponsor.preferredPlatforms,
      ) === 0
    ) {
      risks.push('No preferred platform alignment.');
    }

    const normalizedCategories = channel.categories.map((item) =>
      this.normalize(item),
    );

    const prohibitedMatch = sponsor.prohibitedTopics.some((topic) =>
      normalizedCategories.includes(this.normalize(topic)),
    );

    if (prohibitedMatch) {
      risks.push('Channel category conflicts with sponsor restrictions.');
    }

    return risks;
  }

  private resolveRiskLevel(
    risks: string[],
    channel: SponsorshipChannelProfile,
  ): SponsorshipRiskLevel {
    if (
      risks.some((risk) =>
        risk.includes('conflicts with sponsor restrictions'),
      )
    ) {
      return 'critical';
    }

    if (risks.length >= 3 || channel.brandSafetyScore < 40) {
      return 'high';
    }

    if (risks.length >= 1) {
      return 'medium';
    }

    return 'low';
  }

  private resolveFitLevel(score: number): SponsorshipFitLevel {
    if (score >= 85) {
      return 'exceptional';
    }

    if (score >= 70) {
      return 'strong';
    }

    if (score >= 50) {
      return 'moderate';
    }

    return 'weak';
  }

  private overlapScore(
    source: string[],
    target: string[],
  ): number {
    if (target.length === 0) {
      return 70;
    }

    const sourceSet = new Set(
      source.map((item) => this.normalize(item)),
    );

    const matched = target.filter((item) =>
      sourceSet.has(this.normalize(item)),
    ).length;

    return this.clamp((matched / target.length) * 100);
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    return this.clamp(
      values.reduce((sum, value) => sum + value, 0) /
        values.length,
    );
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
