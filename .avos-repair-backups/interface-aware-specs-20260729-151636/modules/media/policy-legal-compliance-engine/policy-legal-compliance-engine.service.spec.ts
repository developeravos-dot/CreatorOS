import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PolicyLegalComplianceEngineService,
} from './policy-legal-compliance-engine.service';

describe('PolicyLegalComplianceEngineService', () => {
  let service: PolicyLegalComplianceEngineService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [PolicyLegalComplianceEngineService],
      }).compile();

    service =
      module.get<PolicyLegalComplianceEngineService>(
        PolicyLegalComplianceEngineService,
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

  it('should create governance record', () => {
    const record = service.createRecord({
      name: 'AVOS Media Safety Review',
      category: 'safety',
      owner: 'AVOS Media',
      type: 'content-safety',
      platform: 'YouTube',
      region: 'UAE',
    });

    expect(record.id).toBeDefined();
    expect(record.platform).toBe('youtube');
    expect(record.region).toBe('uae');
  });

  it('should reject empty name', () => {
    expect(() =>
      service.createRecord({
        name: '',
        category: 'safety',
        owner: 'AVOS Media',
      }),
    ).toThrow(BadRequestException);
  });

  it('should start assessment', () => {
    const record = service.createRecord({
      name: 'Assessment',
      category: 'compliance',
      owner: 'AVOS Media',
    });

    expect(
      service.startAssessment(record.id).status,
    ).toBe('assessment');
  });

  it('should block publishing', () => {
    const record = service.createRecord({
      name: 'Blocked Content',
      category: 'risk',
      owner: 'AVOS Media',
    });

    const updated =
      service.blockPublishing(record.id);

    expect(updated.publishingBlocked).toBe(
      true,
    );
    expect(updated.status).toBe('blocked');
  });

  it('should require approval before releasing block', () => {
    const record = service.createRecord({
      name: 'Protected Block',
      category: 'risk',
      owner: 'AVOS Media',
      publishingBlocked: true,
    });

    expect(() =>
      service.releasePublishingBlock(
        record.id,
      ),
    ).toThrow(BadRequestException);
  });

  it('should release block after approval', () => {
    const record = service.createRecord({
      name: 'Approved Block',
      category: 'risk',
      owner: 'AVOS Media',
      publishingBlocked: true,
    });

    service.approveByHuman(record.id);

    const updated =
      service.releasePublishingBlock(
        record.id,
      );

    expect(updated.publishingBlocked).toBe(
      false,
    );
  });

  it('should add finding', () => {
    const record = service.createRecord({
      name: 'Finding',
      category: 'audit',
      owner: 'AVOS Media',
    });

    const updated = service.addFinding(
      record.id,
      {
        title: 'Missing disclosure',
        severity: 'high',
      },
    );

    expect(updated.findings).toHaveLength(1);
    expect(updated.findings[0]!.severity).toBe(
      'high',
    );
  });

  it('should block critical finding', () => {
    const record = service.createRecord({
      name: 'Critical Finding',
      category: 'risk',
      owner: 'AVOS Media',
    });

    const updated = service.addFinding(
      record.id,
      {
        title: 'Critical legal risk',
        severity: 'critical',
      },
    );

    expect(updated.publishingBlocked).toBe(
      true,
    );
    expect(updated.status).toBe('blocked');
  });

  it('should resolve finding', () => {
    const record = service.createRecord({
      name: 'Resolve Finding',
      category: 'audit',
      owner: 'AVOS Media',
    });

    const withFinding = service.addFinding(
      record.id,
      {
        title: 'Policy issue',
      },
    );

    const findingId =
      withFinding.findings[0]!.id;

    const updated = service.resolveFinding(
      record.id,
      findingId,
    );

    expect(updated.findings[0]!.status).toBe(
      'resolved',
    );
  });

  it('should add audit event', () => {
    const record = service.createRecord({
      name: 'Audit Event',
      category: 'audit',
      owner: 'AVOS Media',
    });

    const updated = service.addAuditEvent(
      record.id,
      {
        action: 'content-reviewed',
        actor: 'Human Reviewer',
      },
    );

    expect(updated.auditTrail).toHaveLength(1);
    expect(updated.auditTrail[0]!.action).toBe(
      'content-reviewed',
    );
  });

  it('should create human approval decision', () => {
    const record = service.createRecord({
      name: 'Human Approval',
      category: 'governance',
      owner: 'AVOS Media',
    });

    const updated = service.approveByHuman(
      record.id,
      'Approved after review',
    );

    expect(updated.humanApproved).toBe(true);
    expect(updated.decisions).toHaveLength(1);
    expect(
      updated.decisions[0]!.humanDecision,
    ).toBe(true);
  });

  it('should generate safety plan', () => {
    const record = service.createRecord({
      name: 'Safety Plan',
      category: 'safety',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateSafetyPlan(record.id);

    expect(plan.controls).toHaveLength(7);
  });

  it('should generate compliance plan', () => {
    const record = service.createRecord({
      name: 'Compliance Plan',
      category: 'compliance',
      owner: 'AVOS Media',
    });

    const plan =
      service.generateCompliancePlan(
        record.id,
      );

    expect(plan.stages).toHaveLength(7);
  });

  it('should generate risk plan', () => {
    const record = service.createRecord({
      name: 'Risk Plan',
      category: 'risk',
      owner: 'AVOS Media',
      riskProbability: 50,
      riskImpact: 80,
    });

    const plan =
      service.generateRiskPlan(record.id);

    expect(plan.riskProbability).toBe(50);
    expect(plan.riskImpact).toBe(80);
  });

  it('should generate audit report', () => {
    const record = service.createRecord({
      name: 'Audit Report',
      category: 'audit',
      owner: 'AVOS Media',
    });

    const report =
      service.generateAuditReport(record.id);

    expect(report.recordName).toBe(
      'Audit Report',
    );
  });

  it('should assess governance readiness', () => {
    const record = service.createRecord({
      name: 'Governance Assessment',
      category: 'governance',
      owner: 'AVOS Media',
      contentSafetyScore: 90,
      legalComplianceScore: 90,
      policyComplianceScore: 90,
      privacyScore: 90,
      copyrightScore: 90,
      brandSafetyScore: 90,
      transparencyScore: 90,
      riskProbability: 20,
      riskImpact: 20,
    });

    const result =
      service.runGovernanceAssessment(
        record.id,
      );

    expect(result.complianceScore).toBe(90);
    expect(result.riskScore).toBe(4);
    expect(result.recommendation).toBe(
      'ready-for-human-approval',
    );
  });

  it('should remove record', () => {
    const record = service.createRecord({
      name: 'Delete Governance',
      category: 'governance',
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
