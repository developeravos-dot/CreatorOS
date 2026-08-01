import { Injectable } from '@nestjs/common';
import {
  SponsorshipOutreachPriority,
} from '../models/sponsorship-outreach.models';

@Injectable()
export class SponsorshipLeadQualificationEngine {
  qualify(input: {
    opportunityScore: number;
    estimatedValue: number;
    hasContact: boolean;
    contactVerified: boolean;
    contactConfidenceScore: number;
  }): {
    qualificationScore: number;
    priority: SponsorshipOutreachPriority;
    reasons: string[];
    nextBestAction: string;
  } {
    const reasons: string[] = [];

    const opportunityScore = this.clamp(
      input.opportunityScore,
    );

    const valueScore = this.clamp(
      Math.log10(Math.max(input.estimatedValue, 10)) * 22,
    );

    const contactScore = input.hasContact
      ? input.contactVerified
        ? 100
        : this.clamp(input.contactConfidenceScore)
      : 0;

    const qualificationScore = Math.round(
      opportunityScore * 0.55 +
        valueScore * 0.25 +
        contactScore * 0.2,
    );

    if (opportunityScore >= 85) {
      reasons.push('Exceptional sponsor-channel opportunity score.');
    } else if (opportunityScore >= 70) {
      reasons.push('Strong sponsor-channel opportunity score.');
    } else if (opportunityScore >= 50) {
      reasons.push('Moderate sponsor-channel opportunity score.');
    } else {
      reasons.push('Low sponsor-channel opportunity score.');
    }

    if (input.estimatedValue >= 10000) {
      reasons.push('High estimated sponsorship value.');
    } else if (input.estimatedValue >= 3000) {
      reasons.push('Meaningful estimated sponsorship value.');
    }

    if (input.contactVerified) {
      reasons.push('Verified sponsor contact is available.');
    } else if (input.hasContact) {
      reasons.push('Sponsor contact requires verification.');
    } else {
      reasons.push('Sponsor decision-maker contact is missing.');
    }

    const priority = this.resolvePriority(
      qualificationScore,
      input.estimatedValue,
    );

    const nextBestAction = this.resolveNextBestAction(
      qualificationScore,
      input.hasContact,
      input.contactVerified,
    );

    return {
      qualificationScore,
      priority,
      reasons,
      nextBestAction,
    };
  }

  private resolvePriority(
    score: number,
    estimatedValue: number,
  ): SponsorshipOutreachPriority {
    if (score >= 85 || estimatedValue >= 25000) {
      return 'critical';
    }

    if (score >= 70 || estimatedValue >= 10000) {
      return 'high';
    }

    if (score >= 50 || estimatedValue >= 3000) {
      return 'medium';
    }

    return 'low';
  }

  private resolveNextBestAction(
    score: number,
    hasContact: boolean,
    verified: boolean,
  ): string {
    if (!hasContact) {
      return 'Find the most relevant sponsorship or marketing decision-maker.';
    }

    if (!verified) {
      return 'Verify the sponsor contact before generating outreach.';
    }

    if (score >= 70) {
      return 'Generate a personalized outreach draft for human approval.';
    }

    if (score >= 50) {
      return 'Enrich the sponsor profile before outreach.';
    }

    return 'Archive the lead until stronger alignment signals appear.';
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
