import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaIpRegistryEngineService,
} from './media-ip-registry-engine.service';

describe('MediaIpRegistryEngineService', () => {
  let service: MediaIpRegistryEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [MediaIpRegistryEngineService],
      }).compile();

    service =
      module.get<MediaIpRegistryEngineService>(
        MediaIpRegistryEngineService,
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

  it('should create IP asset', () => {
    const record = service.createRecord({
      name: 'AVOS Original Universe',
      category: 'original-ip',
      owner: 'AVOS Media',
      type: 'story-world',
      language: 'Arabic',
      originCountry: 'UAE',
      targetMarkets: [
        'UAE',
        'Global',
      ],
    });

    expect(record.id).toBeDefined();
    expect(record.language).toBe('arabic');
    expect(record.originCountry).toBe('uae');
    expect(record.digitalDna).toContain(
      'AVOS-IP',
    );
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'ip',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject empty owner', () => {
    expect(() =>
      service.createRecord({
        name: 'IP Asset',
        category: 'ip',
        owner: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('should discover asset', () => {
    const record = service.createRecord({
      name: 'Discovery',
      category: 'ip',
      owner: 'AVOS Media',
    });

    expect(
      service.discoverAsset(record.id).status,
    ).toBe('discovered');
  });

  it('should mark asset protected', () => {
    const record = service.createRecord({
      name: 'Protection',
      category: 'ip',
      owner: 'AVOS Media',
    });

    expect(
      service.markProtected(record.id).status,
    ).toBe('protected');
  });

  it('should require approval before licensing', () => {
    const record = service.createRecord({
      name: 'Protected Licensing',
      category: 'licensing',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.startLicensing(record.id),
    ).toThrow(BadRequestException);
  });

  it('should license after approval', () => {
    const record = service.createRecord({
      name: 'Approved Licensing',
      category: 'licensing',
      owner: 'AVOS Media',
    });

    service.approveByHuman(record.id);

    expect(
      service.startLicensing(record.id).status,
    ).toBe('licensing');
  });

  it('should add IP family node', () => {
    const record = service.createRecord({
      name: 'Family Tree',
      category: 'franchise',
      owner: 'AVOS Media',
    });

    const updated = service.addFamilyNode(
      record.id,
      {
        name: 'First Spin-Off',
        type: 'character-ip',
        relationship: 'spin-off',
      },
    );

    expect(updated.familyTree).toHaveLength(1);
    expect(
      updated.familyTree[0]!.relationship,
    ).toBe('spin-off');
  });

  it('should update IP family node', () => {
    const record = service.createRecord({
      name: 'Update Family',
      category: 'franchise',
      owner: 'AVOS Media',
    });

    const withNode = service.addFamilyNode(
      record.id,
      {
        name: 'Sequel',
        relationship: 'sequel',
      },
    );

    const nodeId = withNode.familyTree[0]!.id;

    const updated = service.updateFamilyNode(
      record.id,
      nodeId,
      {
        status: 'active',
      },
    );

    expect(
      updated.familyTree[0]!.status,
    ).toBe('active');
  });

  it('should remove IP family node', () => {
    const record = service.createRecord({
      name: 'Remove Family',
      category: 'franchise',
      owner: 'AVOS Media',
    });

    const withNode = service.addFamilyNode(
      record.id,
      {
        name: 'Temporary Node',
      },
    );

    const nodeId = withNode.familyTree[0]!.id;

    const updated = service.removeFamilyNode(
      record.id,
      nodeId,
    );

    expect(updated.familyTree).toHaveLength(0);
  });

  it('should add IP right', () => {
    const record = service.createRecord({
      name: 'Rights',
      category: 'rights',
      owner: 'AVOS Media',
    });

    const updated = service.addRight(
      record.id,
      {
        rightType: 'copyright',
        territory: 'Global',
        owner: 'AVOS Media',
        status: 'registered',
      },
    );

    expect(updated.rights).toHaveLength(1);
    expect(
      updated.rights[0]!.territory,
    ).toBe('global');
  });

  it('should update IP right', () => {
    const record = service.createRecord({
      name: 'Update Rights',
      category: 'rights',
      owner: 'AVOS Media',
    });

    const withRight = service.addRight(
      record.id,
      {
        rightType: 'format-right',
      },
    );

    const rightId = withRight.rights[0]!.id;

    const updated = service.updateRight(
      record.id,
      rightId,
      {
        status: 'licensed',
      },
    );

    expect(updated.rights[0]!.status).toBe(
      'licensed',
    );
  });

  it('should remove IP right', () => {
    const record = service.createRecord({
      name: 'Remove Rights',
      category: 'rights',
      owner: 'AVOS Media',
    });

    const withRight = service.addRight(
      record.id,
      {
        rightType: 'copyright',
      },
    );

    const rightId = withRight.rights[0]!.id;

    const updated = service.removeRight(
      record.id,
      rightId,
    );

    expect(updated.rights).toHaveLength(0);
  });

  it('should generate digital DNA profile', () => {
    const record = service.createRecord({
      name: 'Digital DNA',
      category: 'ip',
      owner: 'AVOS Media',
      characters: ['Character One'],
      themes: ['Future'],
    });

    const profile =
      service.generateDigitalDnaProfile(
        record.id,
      );

    expect(profile.digitalDna).toContain(
      'AVOS-IP',
    );
  });

  it('should generate protection plan', () => {
    const record = service.createRecord({
      name: 'Protection Plan',
      category: 'protection',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateProtectionPlan(
        record.id,
      );

    expect(plan.protectionStages).toHaveLength(
      8,
    );
  });

  it('should generate franchise plan', () => {
    const record = service.createRecord({
      name: 'Franchise Plan',
      category: 'franchise',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateFranchisePlan(record.id);

    expect(plan.expansionModels).toHaveLength(
      10,
    );
  });

  it('should generate licensing plan', () => {
    const record = service.createRecord({
      name: 'Licensing Plan',
      category: 'licensing',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateLicensingPlan(record.id);

    expect(plan.licensingModels).toHaveLength(
      8,
    );
  });

  it('should generate expansion plan', () => {
    const record = service.createRecord({
      name: 'Expansion Plan',
      category: 'expansion',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateExpansionPlan(record.id);

    expect(plan.expansionStages).toHaveLength(
      8,
    );
  });

  it('should calculate IP financial performance', () => {
    const record = service.createRecord({
      name: 'IP Financials',
      category: 'finance',
      owner: 'AVOS Media',
      licensingRevenue: 1000,
      royaltyRevenue: 500,
      merchandiseRevenue: 500,
      adaptationRevenue: 1000,
      protectionCost: 500,
      developmentCost: 500,
    });

    const result =
      service.calculateIpFinancialPerformance(
        record.id,
      );

    expect(result.totalRevenue).toBe(3000);
    expect(result.totalCost).toBe(1000);
    expect(result.profit).toBe(2000);
    expect(result.returnOnInvestment).toBe(200);
  });

  it('should assess IP readiness', () => {
    const record = service.createRecord({
      name: 'IP Assessment',
      category: 'ip',
      owner: 'AVOS Media',
      originalityScore: 90,
      ownershipClarityScore: 90,
      protectionScore: 90,
      licensingPotentialScore: 90,
      franchisePotentialScore: 90,
      globalExpansionScore: 90,
      commercialValueScore: 90,
      strategicValueScore: 90,
    });

    const result =
      service.runIpAssessment(record.id);

    expect(result.score).toBe(90);

    expect(result.recommendation).toBe(
      'strategic-ip-ready-for-human-approval',
    );
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete IP',
      category: 'ip',
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
