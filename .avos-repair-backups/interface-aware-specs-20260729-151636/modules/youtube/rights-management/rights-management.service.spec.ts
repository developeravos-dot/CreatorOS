import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RightsManagementService,
} from './rights-management.service';

describe('RightsManagementService', () => {
  let service: RightsManagementService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [RightsManagementService],
      }).compile();

    service = module.get<RightsManagementService>(
      RightsManagementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe('operational');
    expect(dashboard.totalRecords).toBe(0);
  });

  it('should create and list a record', () => {
    const record = service.createRecord({
      name: 'CreatorOS Brand',
      category: 'media',
      owner: 'CreatorOS',
      ipType: 'brand',
      rightsScope: 'global',
      territory: 'global',
      brandScore: 85,
      protectionScore: 75,
      commercialScore: 90,
      tags: ['Brand', 'YouTube'],
    });

    expect(record.id).toBeDefined();
    expect(record.territory).toBe('GLOBAL');
    expect(record.tags).toEqual([
      'brand',
      'youtube',
    ]);
    expect(service.listRecords()).toHaveLength(1);
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'media',
        owner: 'CreatorOS',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'Protected Brand',
        category: 'media',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should update a record', () => {
    const record = service.createRecord({
      name: 'Update IP',
      category: 'content',
      owner: 'CreatorOS',
    });

    const updated = service.updateRecord(
      record.id,
      {
        priority: 'high',
        commercialScore: 92,
      },
    );

    expect(updated.priority).toBe('high');
    expect(updated.commercialScore).toBe(92);
  });

  it('should move through review and activation', () => {
    const record = service.createRecord({
      name: 'Workflow IP',
      category: 'workflow',
      owner: 'CreatorOS',
    });

    const review =
      service.submitForReview(record.id);

    const active =
      service.activateRecord(record.id);

    expect(review.status).toBe('review');
    expect(active.status).toBe('active');
  });

  it('should protect a record', () => {
    const record = service.createRecord({
      name: 'Protected IP',
      category: 'rights',
      owner: 'CreatorOS',
      protectionScore: 30,
    });

    const protectedRecord =
      service.protectRecord(
        record.id,
        'REG-100',
      );

    expect(protectedRecord.status).toBe(
      'protected',
    );
    expect(
      protectedRecord.protectionScore,
    ).toBeGreaterThanOrEqual(75);
    expect(
      protectedRecord.registrationNumber,
    ).toBe('REG-100');
  });

  it('should license a record', () => {
    const record = service.createRecord({
      name: 'Licensed Format',
      category: 'format',
      owner: 'CreatorOS',
      ipType: 'format',
    });

    const licensed = service.licenseRecord(
      record.id,
      {
        partner: 'Global Partner',
        rightsScope: 'non-exclusive',
        territory: 'US',
        licenseValue: 10000,
        royaltyRate: 10,
        licenseStartDate: '2026-01-01',
        licenseEndDate: '2027-01-01',
      },
    );

    expect(licensed.status).toBe('licensed');
    expect(licensed.partner).toBe(
      'Global Partner',
    );
    expect(licensed.licenseValue).toBe(10000);
  });

  it('should calculate license revenue', () => {
    const record = service.createRecord({
      name: 'Revenue IP',
      category: 'licensing',
      owner: 'CreatorOS',
      licenseValue: 5000,
      royaltyRate: 10,
    });

    const result =
      service.calculateLicenseRevenue(
        record.id,
        20000,
      );

    expect(result.royaltyRevenue).toBe(2000);
    expect(result.totalExpectedRevenue).toBe(
      7000,
    );
  });

  it('should evaluate protection risks', () => {
    const record = service.createRecord({
      name: 'Risk IP',
      category: 'rights',
      owner: 'CreatorOS',
      rightsScope: 'global',
      protectionScore: 20,
    });

    const evaluation =
      service.evaluateProtection(record.id);

    expect(evaluation.risks.length).toBeGreaterThan(
      0,
    );
  });

  it('should generate recommendations', () => {
    const record = service.createRecord({
      name: 'Recommendation IP',
      category: 'analysis',
      owner: 'CreatorOS',
      brandScore: 20,
      protectionScore: 20,
      commercialScore: 20,
    });

    const recommendations =
      service.generateRecommendations(record.id);

    expect(
      recommendations.length,
    ).toBeGreaterThan(0);
  });

  it('should return top records safely', () => {
    service.createRecord({
      name: 'Low Commercial IP',
      category: 'ranking',
      owner: 'CreatorOS',
      commercialScore: 20,
    });

    service.createRecord({
      name: 'High Commercial IP',
      category: 'ranking',
      owner: 'CreatorOS',
      commercialScore: 95,
    });

    const top = service.getTopRecords(1);

    expect(top).toHaveLength(1);
    expect(top[0]?.name).toBe(
      'High Commercial IP',
    );
  });

  it('should remove a record', () => {
    const record = service.createRecord({
      name: 'Delete IP',
      category: 'delete',
      owner: 'CreatorOS',
    });

    service.removeRecord(record.id);

    expect(service.listRecords()).toHaveLength(0);
  });

  it('should throw for missing record', () => {
    expect(() =>
      service.getRecord('missing-id'),
    ).toThrow(NotFoundException);
  });
});
