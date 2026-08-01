import { Test } from '@nestjs/testing';
import { SponsorshipMatchingEngine } from '../engines/sponsorship-matching.engine';
import { SponsorshipPricingEngine } from '../engines/sponsorship-pricing.engine';
import { SponsorshipStrategyEngine } from '../engines/sponsorship-strategy.engine';
import { SponsorshipRepository } from '../repositories/sponsorship.repository';
import { SponsorshipIntelligenceService } from './sponsorship-intelligence.service';

describe('SponsorshipIntelligenceService', () => {
  let service: SponsorshipIntelligenceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SponsorshipIntelligenceService,
        SponsorshipMatchingEngine,
        SponsorshipPricingEngine,
        SponsorshipStrategyEngine,
        SponsorshipRepository,
      ],
    }).compile();

    service = moduleRef.get(
      SponsorshipIntelligenceService,
    );
  });

  it('reports Mega Pack 1A as operational', () => {
    const result = service.status();

    expect(result.success).toBe(true);
    expect(result.megaPack).toBe('1A');
    expect(result.status).toBe('operational');
    expect(result.humanFinalAuthority).toBe(true);
  });

  it('discovers and scores sponsorship opportunities', () => {
    const opportunities = service.discover({
      channel: {
        channelId: 'creatoros-main',
        channelName: 'CreatorOS',
        platforms: ['YouTube', 'TikTok'],
        categories: ['technology', 'artificial intelligence'],
        audience: {
          countries: ['UAE', 'Saudi Arabia'],
          languages: ['Arabic', 'English'],
          ageRanges: ['18-24', '25-34'],
          interests: ['technology', 'AI', 'business'],
          estimatedReach: 250000,
          engagementRate: 7.5,
        },
        averageViews: 85000,
        publishingFrequencyPerMonth: 12,
        brandSafetyScore: 94,
        contentQualityScore: 91,
      },
      sponsors: [
        {
          sponsorId: 'sponsor-1',
          companyName: 'Future Technology',
          industries: ['technology'],
          targetCountries: ['UAE'],
          targetLanguages: ['Arabic'],
          targetAgeRanges: ['18-24', '25-34'],
          targetInterests: ['technology', 'AI'],
          preferredPlatforms: ['YouTube', 'TikTok'],
          preferredContentCategories: [
            'technology',
            'artificial intelligence',
          ],
          estimatedBudgetMin: 1500,
          estimatedBudgetMax: 8000,
          currency: 'AED',
          brandSafetyRequirements: [],
          prohibitedTopics: [],
        },
      ],
    });

    expect(opportunities).toHaveLength(1);
    expect(opportunities[0]!.score).toBeGreaterThan(0);
    expect(
      opportunities[0]!.requiresHumanApproval,
    ).toBe(true);
  });
});

