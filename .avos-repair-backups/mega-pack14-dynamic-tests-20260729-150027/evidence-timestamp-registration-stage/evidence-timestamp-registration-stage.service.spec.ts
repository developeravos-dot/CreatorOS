import {
  BadRequestException,
} from '@nestjs/common';

import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  EvidenceTimestampRegistrationStageService,
} from './evidence-timestamp-registration-stage.service';

describe('EvidenceTimestampRegistrationStageService', () => {
  let service: EvidenceTimestampRegistrationStageService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          EvidenceTimestampRegistrationStageService,
        ],
      }).compile();

    service =
      module.get<EvidenceTimestampRegistrationStageService>(
        EvidenceTimestampRegistrationStageService,
      );
  });

  it('should be operational', () => {
    const dashboard = service.getDashboard();

    expect(dashboard.status).toBe(
      'operational',
    );

    expect(dashboard.totalStages).toBe(24);

    expect(
      dashboard.humanFinalAuthority,
    ).toBe(true);
  });

  it('should expose 24-stage blueprint', () => {
    expect(
      service.getBlueprint().stages,
    ).toHaveLength(24);
  });

  it('should create IP asset', () => {
    const asset = service.createAsset({
      name: 'AVOS Original Media Format',
      owner: 'AVOS Media',
      type: 'format',
      targetCountries: [
        'UAE',
        'USA',
        'Germany',
      ],
    });

    expect(asset.stages).toHaveLength(24);

    expect(asset.currentStage).toBe(
      'ip-asset-discovery',
    );
  });

  it('should require autonomy approval', () => {
    const asset = service.createAsset({
      name: 'Autonomous IP Asset',
      owner: 'AVOS Media',
      autonomousExecutionEnabled: true,
    });

    expect(() =>
      service.startLifecycle(asset.id),
    ).toThrow(BadRequestException);
  });

  it('should start approved lifecycle', () => {
    const asset = service.createAsset({
      name: 'Approved IP Asset',
      owner: 'AVOS Media',
      autonomousExecutionEnabled: true,
    });

    service.approveAutonomousExecution(
      asset.id,
      'Human Final Authority',
    );

    expect(
      service.startLifecycle(asset.id).status,
    ).toBe('running');
  });

  it('should generate digital DNA', () => {
    const asset = service.createAsset({
      name: 'Digital DNA Asset',
      owner: 'AVOS Media',
    });

    const updated =
      service.generateDigitalDna(asset.id);

    expect(updated.digitalDna.length).toBeGreaterThan(
      10,
    );
  });

  it('should register and verify evidence', () => {
    const asset = service.createAsset({
      name: 'Evidence Asset',
      owner: 'AVOS Media',
    });

    const withEvidence = service.addEvidence(
      asset.id,
      {
        title: 'Original source file',
        type: 'source-file',
        reference: 'vault://source-file',
      },
    );

    const evidence =
      withEvidence.evidence[0]!;

    const verified =
      service.verifyEvidence(
        asset.id,
        evidence.id,
        'Human Final Authority',
      );

    expect(
      verified.evidence[0]?.verified,
    ).toBe(true);
  });

  it('should prevent ownership above 100%', () => {
    const asset = service.createAsset({
      name: 'Rights Asset',
      owner: 'AVOS Media',
    });

    service.addRightsRecord(asset.id, {
      ownerName: 'Owner One',
      ownershipPercentage: 70,
    });

    expect(() =>
      service.addRightsRecord(asset.id, {
        ownerName: 'Owner Two',
        ownershipPercentage: 40,
      }),
    ).toThrow(BadRequestException);
  });

  it('should calculate valuation', () => {
    const asset = service.createAsset({
      name: 'Valuation Asset',
      owner: 'AVOS Media',
    });

    const updated =
      service.calculateValuation(asset.id, {
        costApproachValue: 100000,
        marketApproachValue: 200000,
        incomeApproachValue: 300000,
        strategicPremium: 50000,
        riskDiscount: 25000,
        currency: 'USD',
      });

    expect(
      updated.valuation.finalValuation,
    ).toBeGreaterThan(0);
  });

  it('should add license', () => {
    const asset = service.createAsset({
      name: 'Licensing Asset',
      owner: 'AVOS Media',
    });

    const updated = service.addLicense(
      asset.id,
      {
        name: 'Regional Media License',
        licenseeName: 'Global Partner',
        upfrontFee: 10000,
        royaltyPercentage: 10,
      },
    );

    expect(updated.licenses).toHaveLength(1);
  });

  it('should add IP product', () => {
    const asset = service.createAsset({
      name: 'Product Asset',
      owner: 'AVOS Media',
    });

    const updated = service.addProduct(
      asset.id,
      {
        name: 'AVOS Media Series',
        type: 'series',
        productionCost: 50000,
        expectedRevenue: 200000,
      },
    );

    expect(updated.products).toHaveLength(1);
  });

  it('should add infringement case', () => {
    const asset = service.createAsset({
      name: 'Protected Asset',
      owner: 'AVOS Media',
    });

    const updated =
      service.addInfringementCase(
        asset.id,
        {
          title: 'Unauthorized reproduction',
          severity: 'high',
          estimatedDamage: 100000,
        },
      );

    expect(
      updated.infringementCases,
    ).toHaveLength(1);
  });

  it('should link IP family assets', () => {
    const parent = service.createAsset({
      name: 'Parent IP',
      owner: 'AVOS Media',
    });

    const child = service.createAsset({
      name: 'Child IP',
      owner: 'AVOS Media',
    });

    const linked = service.linkChildAsset(
      parent.id,
      child.id,
    );

    expect(
      linked.parent.childAssetIds,
    ).toContain(child.id);
  });

  it('should generate protection plan', () => {
    const asset = service.createAsset({
      name: 'Software Asset',
      owner: 'AVOS Media',
      type: 'software',
    });

    const plan =
      service.generateProtectionPlan(
        asset.id,
      );

    expect(
      plan.recommendedProtectionTypes.length,
    ).toBeGreaterThan(0);
  });

  it('should generate commercialization plan', () => {
    const asset = service.createAsset({
      name: 'Commercial Asset',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateCommercializationPlan(
        asset.id,
      );

    expect(
      plan.recommendedModels.length,
    ).toBeGreaterThan(5);
  });

  it('should generate IP report', () => {
    const asset = service.createAsset({
      name: 'Report Asset',
      owner: 'AVOS Media',
    });

    const report =
      service.generateIpReport(asset.id);

    expect(report.totalStages).toBe(24);

    expect(
      report.humanFinalAuthority,
    ).toBe(true);
  });
});
