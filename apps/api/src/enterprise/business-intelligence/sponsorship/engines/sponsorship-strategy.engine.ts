import { Injectable } from '@nestjs/common';
import {
  SponsorProfile,
  SponsorshipChannelProfile,
} from '../models/sponsorship.models';

@Injectable()
export class SponsorshipStrategyEngine {
  recommendFormats(
    channel: SponsorshipChannelProfile,
  ): string[] {
    const formats: string[] = [
      'Integrated sponsored segment',
      'Dedicated sponsored video',
      'Product demonstration',
      'Branded short-form video',
    ];

    if (
      channel.platforms.some((platform) =>
        ['youtube', 'tiktok'].includes(
          platform.trim().toLowerCase(),
        ),
      )
    ) {
      formats.push('Cross-platform sponsorship package');
    }

    if (channel.publishingFrequencyPerMonth >= 8) {
      formats.push('Monthly recurring brand partnership');
    }

    return formats;
  }

  buildValueProposition(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
  ): string[] {
    return [
      `Access to an estimated audience reach of ${channel.audience.estimatedReach}.`,
      `Average content performance of ${channel.averageViews} views.`,
      `Audience engagement rate of ${channel.audience.engagementRate}%.`,
      `Brand-safety score of ${channel.brandSafetyScore}/100.`,
      `Content-quality score of ${channel.contentQualityScore}/100.`,
      `Audience alignment with ${sponsor.companyName} target markets.`,
    ];
  }

  buildNegotiationPoints(
    channel: SponsorshipChannelProfile,
    sponsor: SponsorProfile,
    recommendedPrice: number,
  ): string[] {
    return [
      `Open negotiations around ${recommendedPrice} ${sponsor.currency}.`,
      'Define exact deliverables, platforms, duration and revision limits.',
      'Request partial advance payment before production.',
      'Keep content ownership and reuse rights explicitly separated.',
      'Charge separately for paid-media usage and content whitelisting.',
      'Include performance reporting without guaranteeing platform results.',
      channel.publishingFrequencyPerMonth >= 8
        ? 'Offer a recurring partnership with a minimum commitment period.'
        : 'Begin with a controlled pilot sponsorship.',
    ];
  }

  nextBestAction(
    score: number,
    riskLevel: string,
  ): string {
    if (riskLevel === 'critical') {
      return 'Reject automatically and submit the conflict for human review.';
    }

    if (score >= 85) {
      return 'Prepare a personalized sponsorship proposal for human approval.';
    }

    if (score >= 70) {
      return 'Qualify the sponsor and generate a targeted outreach draft.';
    }

    if (score >= 50) {
      return 'Collect additional sponsor and audience data before outreach.';
    }

    return 'Keep the sponsor in the intelligence database without outreach.';
  }
}
