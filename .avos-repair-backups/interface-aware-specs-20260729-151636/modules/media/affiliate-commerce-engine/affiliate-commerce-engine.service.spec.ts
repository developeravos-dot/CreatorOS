import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AffiliateCommerceEngineService,
} from './affiliate-commerce-engine.service';

describe('AffiliateCommerceEngineService', () => {
  let service: AffiliateCommerceEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [AffiliateCommerceEngineService],
      }).compile();

    service =
      module.get<AffiliateCommerceEngineService>(
        AffiliateCommerceEngineService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe(
      'operational',
    );

    expect(
      dashboard.humanFinalAuthority,
    ).toBe(true);
  });

  it('should create monetization record', () => {
    const record = service.createRecord({
      name: 'AVOS Revenue Campaign',
      category: 'revenue',
      owner: 'AVOS Media',
      type: 'sponsorship',
      currency: 'USD',
      targetRevenue: 100000,
      platform: 'YouTube',
    });

    expect(record.id).toBeDefined();
    expect(record.currency).toBe('USD');
    expect(record.platform).toBe('youtube');
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'revenue',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Revenue',
        category: 'revenue',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should start discovery', () => {
    const record = service.createRecord({
      name: 'Discovery',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    expect(
      service.startDiscovery(record.id).status,
    ).toBe('discovery');
  });

  it('should start negotiation', () => {
    const record = service.createRecord({
      name: 'Negotiation',
      category: 'sponsorship',
      owner: 'AVOS Media',
    });

    expect(
      service.startNegotiation(record.id)
        .status,
    ).toBe('negotiation');
  });

  it('should require human approval before activation', () => {
    const record = service.createRecord({
      name: 'Protected Monetization',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.activateMonetization(record.id),
    ).toThrow(BadRequestException);
  });

  it('should activate after approval', () => {
    const record = service.createRecord({
      name: 'Approved Monetization',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    service.approveByHuman(record.id);

    expect(
      service.activateMonetization(record.id)
        .status,
    ).toBe('active');
  });

  it('should add revenue transaction', () => {
    const record = service.createRecord({
      name: 'Revenue Transaction',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    const updated = service.addTransaction(
      record.id,
      {
        source: 'YouTube',
        type: 'revenue',
        amount: 500,
        currency: 'USD',
      },
    );

    expect(updated.transactions).toHaveLength(
      1,
    );

    expect(updated.actualRevenue).toBe(500);
  });

  it('should calculate transaction costs', () => {
    const record = service.createRecord({
      name: 'Cost Transaction',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    const updated = service.addTransaction(
      record.id,
      {
        source: 'Production',
        type: 'cost',
        amount: 200,
        currency: 'USD',
      },
    );

    expect(updated.actualCost).toBe(200);
  });

  it('should remove transaction', () => {
    const record = service.createRecord({
      name: 'Remove Transaction',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    const withTransaction =
      service.addTransaction(record.id, {
        source: 'Sponsor',
        type: 'revenue',
        amount: 1000,
      });

    const transactionId =
      withTransaction.transactions[0]!.id;

    const updated =
      service.removeTransaction(
        record.id,
        transactionId,
      );

    expect(updated.transactions).toHaveLength(
      0,
    );
  });

  it('should add commercial partner', () => {
    const record = service.createRecord({
      name: 'Partner',
      category: 'sponsorship',
      owner: 'AVOS Media',
    });

    const updated = service.addPartner(
      record.id,
      {
        name: 'Global Sponsor',
        type: 'sponsor',
        estimatedValue: 50000,
      },
    );

    expect(updated.partners).toHaveLength(1);

    expect(updated.partners[0]!.name).toBe(
      'Global Sponsor',
    );
  });

  it('should update commercial partner', () => {
    const record = service.createRecord({
      name: 'Update Partner',
      category: 'sponsorship',
      owner: 'AVOS Media',
    });

    const withPartner = service.addPartner(
      record.id,
      {
        name: 'Sponsor',
      },
    );

    const partnerId =
      withPartner.partners[0]!.id;

    const updated = service.updatePartner(
      record.id,
      partnerId,
      {
        status: 'active',
      },
    );

    expect(updated.partners[0]!.status).toBe(
      'active',
    );
  });

  it('should remove commercial partner', () => {
    const record = service.createRecord({
      name: 'Remove Partner',
      category: 'sponsorship',
      owner: 'AVOS Media',
    });

    const withPartner = service.addPartner(
      record.id,
      {
        name: 'Temporary Partner',
      },
    );

    const partnerId =
      withPartner.partners[0]!.id;

    const updated = service.removePartner(
      record.id,
      partnerId,
    );

    expect(updated.partners).toHaveLength(0);
  });

  it('should generate advertising plan', () => {
    const record = service.createRecord({
      name: 'Advertising',
      category: 'advertising',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateAdvertisingPlan(
        record.id,
      );

    expect(plan.advertisingModels).toHaveLength(
      6,
    );
  });

  it('should generate sponsorship plan', () => {
    const record = service.createRecord({
      name: 'Sponsorship',
      category: 'sponsorship',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateSponsorshipPlan(
        record.id,
      );

    expect(
      plan.sponsorshipPackages,
    ).toHaveLength(6);
  });

  it('should generate affiliate plan', () => {
    const record = service.createRecord({
      name: 'Affiliate',
      category: 'affiliate',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateAffiliatePlan(record.id);

    expect(plan.funnelStages).toHaveLength(7);
  });

  it('should generate digital product plan', () => {
    const record = service.createRecord({
      name: 'Digital Product',
      category: 'product',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateDigitalProductPlan(
        record.id,
      );

    expect(plan.productModels).toHaveLength(8);
  });

  it('should generate licensing plan', () => {
    const record = service.createRecord({
      name: 'Licensing',
      category: 'licensing',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateLicensingPlan(record.id);

    expect(plan.licensingModels).toHaveLength(
      8,
    );
  });

  it('should calculate commercial performance', () => {
    const record = service.createRecord({
      name: 'Commercial Performance',
      category: 'analytics',
      owner: 'AVOS Media',
      impressions: 1000,
      clicks: 100,
      leads: 20,
      sales: 10,
      actualRevenue: 1000,
      actualCost: 500,
    });

    const result =
      service.calculateCommercialPerformance(
        record.id,
      );

    expect(result.clickThroughRate).toBe(10);
    expect(result.leadConversionRate).toBe(20);
    expect(result.salesConversionRate).toBe(50);
    expect(result.profit).toBe(500);
    expect(result.returnOnInvestment).toBe(100);
  });

  it('should assess monetization readiness', () => {
    const record = service.createRecord({
      name: 'Assessment',
      category: 'revenue',
      owner: 'AVOS Media',
      monetizationScore: 90,
      audienceValueScore: 90,
      sponsorFitScore: 90,
      productFitScore: 90,
      licensingPotentialScore: 90,
      profitabilityScore: 90,
      confidenceScore: 90,
    });

    const result =
      service.runMonetizationAssessment(
        record.id,
      );

    expect(result.score).toBe(90);

    expect(result.recommendation).toBe(
      'ready-for-human-approval',
    );
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Monetization',
      category: 'revenue',
      owner: 'AVOS Media',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(
      0,
    );
  });

  it('should throw for missing record', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
