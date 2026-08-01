import { Test } from '@nestjs/testing';
import { SponsorshipDealRepository } from '../repositories/sponsorship-deal.repository';
import { SponsorshipDealService } from './sponsorship-deal.service';

describe('SponsorshipDealService', () => {
  let service: SponsorshipDealService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SponsorshipDealService,
        SponsorshipDealRepository,
      ],
    }).compile();

    service = moduleRef.get(SponsorshipDealService);
  });

  it('reports Mega Pack 1C as operational', () => {
    const result = service.status();

    expect(result.success).toBe(true);
    expect(result.megaPack).toBe('1C');
    expect(result.status).toBe('operational');
    expect(result.humanFinalAuthority).toBe(true);
  });

  it('creates a sponsorship deal', () => {
    const deal = service.createDeal({
      sponsorId: 'sponsor-1',
      companyName: 'Future Technology',
      campaignName: 'CreatorOS AI Campaign',
      proposedValue: 12000,
      minimumAcceptableValue: 8000,
      currency: 'AED',
      deliverables: [
        {
          title: 'YouTube Integration',
          platform: 'YouTube',
          format: 'Integrated segment',
          quantity: 1,
          agreedValue: 12000,
          currency: 'AED',
        },
      ],
      paymentMilestones: [
        {
          title: 'Advance',
          percentage: 50,
        },
        {
          title: 'Completion',
          percentage: 50,
        },
      ],
    });

    expect(deal.companyName).toBe(
      'Future Technology',
    );
    expect(deal.paymentMilestones).toHaveLength(2);
    expect(deal.requiresHumanApproval).toBe(true);
  });
});
