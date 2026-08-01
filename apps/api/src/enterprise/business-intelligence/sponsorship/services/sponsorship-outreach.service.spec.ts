import { Test } from '@nestjs/testing';
import { SponsorshipLeadQualificationEngine } from '../engines/sponsorship-lead-qualification.engine';
import { SponsorshipOutreachGenerationEngine } from '../engines/sponsorship-outreach-generation.engine';
import { SponsorshipOutreachRepository } from '../repositories/sponsorship-outreach.repository';
import { SponsorshipOutreachService } from './sponsorship-outreach.service';

describe('SponsorshipOutreachService', () => {
  let service: SponsorshipOutreachService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SponsorshipOutreachService,
        SponsorshipLeadQualificationEngine,
        SponsorshipOutreachGenerationEngine,
        SponsorshipOutreachRepository,
      ],
    }).compile();

    service = moduleRef.get(
      SponsorshipOutreachService,
    );
  });

  it('reports Mega Pack 1B as operational', () => {
    const result = service.status();

    expect(result.success).toBe(true);
    expect(result.megaPack).toBe('1B');
    expect(result.status).toBe('operational');
    expect(result.humanFinalAuthority).toBe(true);
    expect(result.autonomousSending).toBe(false);
  });

  it('creates and qualifies a verified sponsor lead', () => {
    const lead = service.createLead({
      sponsorId: 'sponsor-1',
      companyName: 'Future Technology',
      opportunityId: 'opportunity-1',
      opportunityScore: 88,
      estimatedValue: 8000,
      currency: 'AED',
      contactName: 'Marketing Director',
      contactRole: 'Head of Partnerships',
      contactEmail: 'partnerships@example.com',
      preferredChannel: 'email',
      contactConfidenceScore: 95,
      contactVerified: true,
    });

    expect(lead.companyName).toBe(
      'Future Technology',
    );

    expect(lead.contact).toBeDefined();
    expect(lead.contact!.verified).toBe(true);
    expect(lead.requiresHumanApproval).toBe(true);
  });

  it('generates a draft requiring human approval', () => {
    const lead = service.createLead({
      sponsorId: 'sponsor-2',
      companyName: 'Innovation Group',
      opportunityScore: 91,
      estimatedValue: 12000,
      currency: 'AED',
      contactName: 'Partnership Team',
      contactEmail: 'brand@example.com',
      preferredChannel: 'email',
      contactConfidenceScore: 100,
      contactVerified: true,
    });

    const draft = service.generateDraft({
      leadId: lead.leadId,
      channelId: 'creatoros-main',
      channelName: 'CreatorOS',
      channelCategories: [
        'technology',
        'artificial intelligence',
      ],
      averageViews: 85000,
      audienceReach: 250000,
      engagementRate: 7.5,
      audienceCountries: [
        'UAE',
        'Saudi Arabia',
      ],
      audienceLanguages: [
        'Arabic',
        'English',
      ],
      campaignIdea:
        'an AI technology educational series',
      senderName: 'CreatorOS Partnerships',
    });

    expect(draft.companyName).toBe(
      'Innovation Group',
    );

    expect(draft.approved).toBe(false);
    expect(draft.sent).toBe(false);
    expect(draft.requiresHumanApproval).toBe(true);
  });
});
