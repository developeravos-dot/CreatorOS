import { Injectable } from '@nestjs/common';
import {
  SponsorshipLead,
  SponsorshipOutreachDraft,
} from '../models/sponsorship-outreach.models';

@Injectable()
export class SponsorshipOutreachGenerationEngine {
  generate(input: {
    lead: SponsorshipLead;
    channelId: string;
    channelName: string;
    channelCategories: string[];
    averageViews: number;
    audienceReach: number;
    engagementRate: number;
    audienceCountries: string[];
    audienceLanguages: string[];
    campaignIdea?: string;
    senderName?: string;
  }): Omit<
    SponsorshipOutreachDraft,
    'draftId' | 'createdAt' | 'updatedAt'
  > {
    const categoryText =
      input.channelCategories.length > 0
        ? input.channelCategories.join(', ')
        : 'digital content';

    const countriesText =
      input.audienceCountries.length > 0
        ? input.audienceCountries.join(', ')
        : 'our target markets';

    const languagesText =
      input.audienceLanguages.length > 0
        ? input.audienceLanguages.join(', ')
        : 'multiple languages';

    const contactName =
      input.lead.contact?.fullName?.trim() || 'Partnership Team';

    const senderName =
      input.senderName?.trim() || input.channelName;

    const campaignIdea =
      input.campaignIdea?.trim() ||
      `a native branded-content collaboration aligned with ${input.lead.companyName}`;

    const subject =
      `Partnership opportunity: ${input.channelName} × ${input.lead.companyName}`;

    const openingLine =
      `Hello ${contactName}, I am reaching out from ${input.channelName} regarding a potential brand partnership.`;

    const message = [
      openingLine,
      '',
      `${input.channelName} creates content focused on ${categoryText}.`,
      `Our content currently reaches approximately ${input.audienceReach} viewers, with average performance of ${input.averageViews} views and an engagement rate of ${input.engagementRate}%.`,
      `Our audience includes viewers across ${countriesText} and consumes content in ${languagesText}.`,
      '',
      `We believe ${input.lead.companyName} could be a strong fit for ${campaignIdea}.`,
      `The proposed collaboration would be designed as an authentic sponsorship integration rather than a disruptive advertisement.`,
      '',
      `Based on the current opportunity analysis, the estimated partnership value is approximately ${input.lead.estimatedValue} ${input.lead.currency}, subject to final deliverables, usage rights and campaign scope.`,
      '',
      'Would you be available for a short discussion to explore the campaign objectives and suitable sponsorship format?',
      '',
      `Best regards,`,
      senderName,
    ].join('\n');

    return {
      leadId: input.lead.leadId,
      sponsorId: input.lead.sponsorId,
      companyName: input.lead.companyName,
      channelName: input.channelName,
      subject,
      openingLine,
      message,
      callToAction:
        'Request a short sponsorship discovery meeting.',
      personalizationPoints: [
        `Sponsor: ${input.lead.companyName}`,
        `Channel: ${input.channelName}`,
        `Estimated opportunity value: ${input.lead.estimatedValue} ${input.lead.currency}`,
        `Audience reach: ${input.audienceReach}`,
        `Average views: ${input.averageViews}`,
        `Engagement rate: ${input.engagementRate}%`,
      ],
      complianceWarnings: [
        'Human approval is required before sending.',
        'Do not guarantee views, sales, conversions or platform performance.',
        'Verify the recipient and contact details before outreach.',
        'Confirm advertising-disclosure requirements before publication.',
        'Confirm content usage rights and paid-media rights separately.',
      ],
      approved: false,
      sent: false,
      requiresHumanApproval: true,
    };
  }
}
