import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type GovernanceStatus =
  | 'draft'
  | 'assessment'
  | 'review'
  | 'remediation'
  | 'human-review'
  | 'approved'
  | 'blocked'
  | 'monitoring'
  | 'resolved'
  | 'archived';

export type GovernancePriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type GovernanceType =
  | 'content-safety'
  | 'policy-compliance'
  | 'legal-compliance'
  | 'brand-safety'
  | 'privacy'
  | 'copyright'
  | 'risk'
  | 'audit'
  | 'incident'
  | 'other';

export interface GovernanceFinding {
  id: string;
  title: string;
  description: string;
  category: string;
  severity:
    | 'informational'
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';
  status:
    | 'open'
    | 'investigating'
    | 'remediating'
    | 'resolved'
    | 'accepted';
  evidence: string[];
  recommendation: string;
  owner: string;
  createdAt: string;
  resolvedAt: string;
}

export interface GovernanceDecision {
  id: string;
  decision:
    | 'approve'
    | 'approve-with-conditions'
    | 'reject'
    | 'block'
    | 'escalate';
  reason: string;
  decidedBy: string;
  humanDecision: boolean;
  conditions: string[];
  decidedAt: string;
}

export interface GovernanceAuditEvent {
  id: string;
  action: string;
  actor: string;
  entityType: string;
  entityId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  occurredAt: string;
}

export interface MediaGovernanceRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: GovernanceType;
  status: GovernanceStatus;
  priority: GovernancePriority;

  owner: string;
  projectId: string;
  contentId: string;
  productionId: string;
  publicationId: string;
  ipAssetId: string;

  platform: string;
  region: string;
  language: string;
  audience: string;

  policies: string[];
  regulations: string[];
  standards: string[];
  prohibitedTopics: string[];
  sensitiveTopics: string[];
  requiredDisclosures: string[];

  findings: GovernanceFinding[];
  decisions: GovernanceDecision[];
  auditTrail: GovernanceAuditEvent[];

  contentSafetyScore: number;
  legalComplianceScore: number;
  policyComplianceScore: number;
  privacyScore: number;
  copyrightScore: number;
  brandSafetyScore: number;
  transparencyScore: number;
  overallComplianceScore: number;

  riskProbability: number;
  riskImpact: number;
  residualRisk: number;

  incidents: string[];
  controls: string[];
  remediationActions: string[];
  recommendations: string[];
  evidenceFiles: string[];
  tags: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;
  publishingBlocked: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaGovernanceInput {
  name: string;
  description?: string;
  category: string;
  type?: GovernanceType;
  status?: GovernanceStatus;
  priority?: GovernancePriority;

  owner: string;
  projectId?: string;
  contentId?: string;
  productionId?: string;
  publicationId?: string;
  ipAssetId?: string;

  platform?: string;
  region?: string;
  language?: string;
  audience?: string;

  policies?: string[];
  regulations?: string[];
  standards?: string[];
  prohibitedTopics?: string[];
  sensitiveTopics?: string[];
  requiredDisclosures?: string[];

  findings?: GovernanceFinding[];
  decisions?: GovernanceDecision[];
  auditTrail?: GovernanceAuditEvent[];

  contentSafetyScore?: number;
  legalComplianceScore?: number;
  policyComplianceScore?: number;
  privacyScore?: number;
  copyrightScore?: number;
  brandSafetyScore?: number;
  transparencyScore?: number;
  overallComplianceScore?: number;

  riskProbability?: number;
  riskImpact?: number;
  residualRisk?: number;

  incidents?: string[];
  controls?: string[];
  remediationActions?: string[];
  recommendations?: string[];
  evidenceFiles?: string[];
  tags?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
  publishingBlocked?: boolean;
}

export interface UpdateMediaGovernanceInput
  extends Partial<CreateMediaGovernanceInput> {}

export abstract class MediaGovernanceEngineBase {
  private readonly records =
    new Map<string, MediaGovernanceRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const records = [...this.records.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media Governance Trust Safety and Compliance',
      humanFinalAuthority: true,

      totalRecords: records.length,

      assessmentRecords: records.filter(
        (record) => record.status === 'assessment',
      ).length,

      reviewRecords: records.filter(
        (record) => record.status === 'review',
      ).length,

      remediationRecords: records.filter(
        (record) => record.status === 'remediation',
      ).length,

      blockedRecords: records.filter(
        (record) => record.publishingBlocked,
      ).length,

      monitoringRecords: records.filter(
        (record) => record.status === 'monitoring',
      ).length,

      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,

      openFindings: records.reduce(
        (total, record) =>
          total +
          record.findings.filter(
            (finding) =>
              finding.status !== 'resolved' &&
              finding.status !== 'accepted',
          ).length,
        0,
      ),

      criticalFindings: records.reduce(
        (total, record) =>
          total +
          record.findings.filter(
            (finding) =>
              finding.severity === 'critical' &&
              finding.status !== 'resolved',
          ).length,
        0,
      ),

      averageComplianceScore: this.average(
        records.map(
          (record) =>
            record.overallComplianceScore,
        ),
      ),

      averageResidualRisk: this.average(
        records.map(
          (record) => record.residualRisk,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaGovernanceInput,
  ): MediaGovernanceRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Governance record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Governance category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Governance owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaGovernanceRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',

      owner,
      projectId: input.projectId?.trim() ?? '',
      contentId: input.contentId?.trim() ?? '',
      productionId:
        input.productionId?.trim() ?? '',
      publicationId:
        input.publicationId?.trim() ?? '',
      ipAssetId: input.ipAssetId?.trim() ?? '',

      platform:
        input.platform?.trim().toLowerCase() ??
        'global',

      region:
        input.region?.trim().toLowerCase() ??
        'global',

      language:
        input.language?.trim().toLowerCase() ??
        'en',

      audience:
        input.audience?.trim() ??
        'general audience',

      policies: this.normalizeList(
        input.policies,
        false,
      ),

      regulations: this.normalizeList(
        input.regulations,
        false,
      ),

      standards: this.normalizeList(
        input.standards,
        false,
      ),

      prohibitedTopics: this.normalizeList(
        input.prohibitedTopics,
        false,
      ),

      sensitiveTopics: this.normalizeList(
        input.sensitiveTopics,
        false,
      ),

      requiredDisclosures: this.normalizeList(
        input.requiredDisclosures,
        false,
      ),

      findings:
        input.findings?.map((finding) =>
          this.normalizeFinding(finding),
        ) ?? [],

      decisions:
        input.decisions?.map((decision) =>
          this.normalizeDecision(decision),
        ) ?? [],

      auditTrail:
        input.auditTrail?.map((event) =>
          this.normalizeAuditEvent(event),
        ) ?? [],

      contentSafetyScore: this.score(
        input.contentSafetyScore ?? 0,
        'contentSafetyScore',
      ),

      legalComplianceScore: this.score(
        input.legalComplianceScore ?? 0,
        'legalComplianceScore',
      ),

      policyComplianceScore: this.score(
        input.policyComplianceScore ?? 0,
        'policyComplianceScore',
      ),

      privacyScore: this.score(
        input.privacyScore ?? 0,
        'privacyScore',
      ),

      copyrightScore: this.score(
        input.copyrightScore ?? 0,
        'copyrightScore',
      ),

      brandSafetyScore: this.score(
        input.brandSafetyScore ?? 0,
        'brandSafetyScore',
      ),

      transparencyScore: this.score(
        input.transparencyScore ?? 0,
        'transparencyScore',
      ),

      overallComplianceScore: this.score(
        input.overallComplianceScore ?? 0,
        'overallComplianceScore',
      ),

      riskProbability: this.score(
        input.riskProbability ?? 0,
        'riskProbability',
      ),

      riskImpact: this.score(
        input.riskImpact ?? 0,
        'riskImpact',
      ),

      residualRisk: this.score(
        input.residualRisk ?? 0,
        'residualRisk',
      ),

      incidents: this.normalizeList(
        input.incidents,
        false,
      ),

      controls: this.normalizeList(
        input.controls,
        false,
      ),

      remediationActions: this.normalizeList(
        input.remediationActions,
        false,
      ),

      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),

      evidenceFiles: this.normalizeList(
        input.evidenceFiles,
        false,
      ),

      tags: this.normalizeList(input.tags),

      metadata: input.metadata ?? {},

      humanApprovalRequired:
        input.humanApprovalRequired ?? true,

      humanApproved:
        input.humanApproved ?? false,

      publishingBlocked:
        input.publishingBlocked ?? false,

      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: GovernanceStatus;
    priority?: GovernancePriority;
    type?: GovernanceType;
    owner?: string;
    platform?: string;
    region?: string;
    search?: string;
    publishingBlocked?: boolean;
    humanApproved?: boolean;
  }) {
    const search =
      filters?.search?.trim().toLowerCase();

    return [...this.records.values()]
      .filter((record) => {
        if (
          filters?.status &&
          record.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.priority &&
          record.priority !== filters.priority
        ) {
          return false;
        }

        if (
          filters?.type &&
          record.type !== filters.type
        ) {
          return false;
        }

        if (
          filters?.owner &&
          record.owner.toLowerCase() !==
            filters.owner.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.platform &&
          record.platform !==
            filters.platform.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.region &&
          record.region !==
            filters.region.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.publishingBlocked !== undefined &&
          record.publishingBlocked !==
            filters.publishingBlocked
        ) {
          return false;
        }

        if (
          filters?.humanApproved !== undefined &&
          record.humanApproved !==
            filters.humanApproved
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            record.name,
            record.description ?? '',
            record.category,
            record.type,
            record.owner,
            record.platform,
            record.region,
            record.language,
            record.audience,
            ...record.policies,
            ...record.regulations,
            ...record.standards,
            ...record.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchable.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (first, second) =>
          second.residualRisk -
          first.residualRisk,
      );
  }

  getRecord(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `${this.engineName} record '${id}' was not found`,
      );
    }

    return record;
  }

  updateRecord(
    id: string,
    input: UpdateMediaGovernanceInput,
  ) {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Governance record name cannot be empty',
      );
    }

    const updated: MediaGovernanceRecord = {
      ...current,
      ...input,

      name:
        input.name?.trim() ?? current.name,

      description:
        input.description?.trim() ??
        current.description,

      category:
        input.category?.trim() ??
        current.category,

      owner:
        input.owner?.trim() ?? current.owner,

      projectId:
        input.projectId?.trim() ??
        current.projectId,

      contentId:
        input.contentId?.trim() ??
        current.contentId,

      productionId:
        input.productionId?.trim() ??
        current.productionId,

      publicationId:
        input.publicationId?.trim() ??
        current.publicationId,

      ipAssetId:
        input.ipAssetId?.trim() ??
        current.ipAssetId,

      platform:
        input.platform?.trim().toLowerCase() ??
        current.platform,

      region:
        input.region?.trim().toLowerCase() ??
        current.region,

      language:
        input.language?.trim().toLowerCase() ??
        current.language,

      audience:
        input.audience?.trim() ??
        current.audience,

      policies:
        input.policies !== undefined
          ? this.normalizeList(
              input.policies,
              false,
            )
          : current.policies,

      regulations:
        input.regulations !== undefined
          ? this.normalizeList(
              input.regulations,
              false,
            )
          : current.regulations,

      standards:
        input.standards !== undefined
          ? this.normalizeList(
              input.standards,
              false,
            )
          : current.standards,

      prohibitedTopics:
        input.prohibitedTopics !== undefined
          ? this.normalizeList(
              input.prohibitedTopics,
              false,
            )
          : current.prohibitedTopics,

      sensitiveTopics:
        input.sensitiveTopics !== undefined
          ? this.normalizeList(
              input.sensitiveTopics,
              false,
            )
          : current.sensitiveTopics,

      requiredDisclosures:
        input.requiredDisclosures !== undefined
          ? this.normalizeList(
              input.requiredDisclosures,
              false,
            )
          : current.requiredDisclosures,

      findings:
        input.findings !== undefined
          ? input.findings.map((finding) =>
              this.normalizeFinding(finding),
            )
          : current.findings,

      decisions:
        input.decisions !== undefined
          ? input.decisions.map((decision) =>
              this.normalizeDecision(decision),
            )
          : current.decisions,

      auditTrail:
        input.auditTrail !== undefined
          ? input.auditTrail.map((event) =>
              this.normalizeAuditEvent(event),
            )
          : current.auditTrail,

      contentSafetyScore:
        input.contentSafetyScore !== undefined
          ? this.score(
              input.contentSafetyScore,
              'contentSafetyScore',
            )
          : current.contentSafetyScore,

      legalComplianceScore:
        input.legalComplianceScore !== undefined
          ? this.score(
              input.legalComplianceScore,
              'legalComplianceScore',
            )
          : current.legalComplianceScore,

      policyComplianceScore:
        input.policyComplianceScore !== undefined
          ? this.score(
              input.policyComplianceScore,
              'policyComplianceScore',
            )
          : current.policyComplianceScore,

      privacyScore:
        input.privacyScore !== undefined
          ? this.score(
              input.privacyScore,
              'privacyScore',
            )
          : current.privacyScore,

      copyrightScore:
        input.copyrightScore !== undefined
          ? this.score(
              input.copyrightScore,
              'copyrightScore',
            )
          : current.copyrightScore,

      brandSafetyScore:
        input.brandSafetyScore !== undefined
          ? this.score(
              input.brandSafetyScore,
              'brandSafetyScore',
            )
          : current.brandSafetyScore,

      transparencyScore:
        input.transparencyScore !== undefined
          ? this.score(
              input.transparencyScore,
              'transparencyScore',
            )
          : current.transparencyScore,

      overallComplianceScore:
        input.overallComplianceScore !== undefined
          ? this.score(
              input.overallComplianceScore,
              'overallComplianceScore',
            )
          : current.overallComplianceScore,

      riskProbability:
        input.riskProbability !== undefined
          ? this.score(
              input.riskProbability,
              'riskProbability',
            )
          : current.riskProbability,

      riskImpact:
        input.riskImpact !== undefined
          ? this.score(
              input.riskImpact,
              'riskImpact',
            )
          : current.riskImpact,

      residualRisk:
        input.residualRisk !== undefined
          ? this.score(
              input.residualRisk,
              'residualRisk',
            )
          : current.residualRisk,

      incidents:
        input.incidents !== undefined
          ? this.normalizeList(
              input.incidents,
              false,
            )
          : current.incidents,

      controls:
        input.controls !== undefined
          ? this.normalizeList(
              input.controls,
              false,
            )
          : current.controls,

      remediationActions:
        input.remediationActions !== undefined
          ? this.normalizeList(
              input.remediationActions,
              false,
            )
          : current.remediationActions,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

      evidenceFiles:
        input.evidenceFiles !== undefined
          ? this.normalizeList(
              input.evidenceFiles,
              false,
            )
          : current.evidenceFiles,

      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,

      metadata:
        input.metadata ?? current.metadata,

      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  startAssessment(id: string) {
    return this.updateRecord(id, {
      status: 'assessment',
    });
  }

  startReview(id: string) {
    return this.updateRecord(id, {
      status: 'review',
    });
  }

  startRemediation(id: string) {
    return this.updateRecord(id, {
      status: 'remediation',
    });
  }

  submitForHumanReview(id: string) {
    return this.updateRecord(id, {
      status: 'human-review',
    });
  }

  approveByHuman(
    id: string,
    reason = 'Approved by human authority',
  ) {
    const record = this.getRecord(id);

    const decision = this.normalizeDecision({
      id: randomUUID(),
      decision: 'approve',
      reason,
      decidedBy: record.owner,
      humanDecision: true,
      conditions: [],
      decidedAt: new Date().toISOString(),
    });

    return this.updateRecord(id, {
      status: 'approved',
      humanApproved: true,
      publishingBlocked: false,
      decisions: [
        ...record.decisions,
        decision,
      ],
    });
  }

  rejectByHuman(
    id: string,
    reason = 'Rejected by human authority',
  ) {
    const record = this.getRecord(id);

    const decision = this.normalizeDecision({
      id: randomUUID(),
      decision: 'reject',
      reason,
      decidedBy: record.owner,
      humanDecision: true,
      conditions: [],
      decidedAt: new Date().toISOString(),
    });

    return this.updateRecord(id, {
      status: 'blocked',
      humanApproved: false,
      publishingBlocked: true,
      decisions: [
        ...record.decisions,
        decision,
      ],
    });
  }

  blockPublishing(id: string) {
    return this.updateRecord(id, {
      status: 'blocked',
      publishingBlocked: true,
    });
  }

  releasePublishingBlock(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before releasing the publishing block',
      );
    }

    return this.updateRecord(id, {
      status: 'approved',
      publishingBlocked: false,
    });
  }

  startMonitoring(id: string) {
    return this.updateRecord(id, {
      status: 'monitoring',
    });
  }

  resolveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'resolved',
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addFinding(
    id: string,
    input: Partial<GovernanceFinding>,
  ) {
    const record = this.getRecord(id);
    const title = input.title?.trim();

    if (!title) {
      throw new BadRequestException(
        'Finding title is required',
      );
    }

    const finding = this.normalizeFinding({
      id: input.id ?? randomUUID(),
      title,
      description:
        input.description?.trim() ?? '',
      category:
        input.category?.trim() ?? 'general',
      severity: input.severity ?? 'medium',
      status: input.status ?? 'open',
      evidence: input.evidence ?? [],
      recommendation:
        input.recommendation?.trim() ?? '',
      owner:
        input.owner?.trim() ?? record.owner,
      createdAt:
        input.createdAt?.trim() ??
        new Date().toISOString(),
      resolvedAt:
        input.resolvedAt?.trim() ?? '',
    });

    const publishingBlocked =
      record.publishingBlocked ||
      finding.severity === 'critical';

    return this.updateRecord(id, {
      findings: [...record.findings, finding],
      publishingBlocked,
      status:
        finding.severity === 'critical'
          ? 'blocked'
          : record.status,
    });
  }

  resolveFinding(
    id: string,
    findingId: string,
  ) {
    const record = this.getRecord(id);

    const exists = record.findings.some(
      (finding) =>
        finding.id === findingId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Finding '${findingId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      findings: record.findings.map(
        (finding) =>
          finding.id === findingId
            ? {
                ...finding,
                status: 'resolved' as const,
                resolvedAt:
                  new Date().toISOString(),
              }
            : finding,
      ),
    });
  }

  addAuditEvent(
    id: string,
    input: Partial<GovernanceAuditEvent>,
  ) {
    const record = this.getRecord(id);

    const event = this.normalizeAuditEvent({
      id: input.id ?? randomUUID(),
      action:
        input.action?.trim() ?? 'unknown',
      actor:
        input.actor?.trim() ?? record.owner,
      entityType:
        input.entityType?.trim() ??
        'media-governance-record',
      entityId:
        input.entityId?.trim() ?? record.id,
      before: input.before ?? {},
      after: input.after ?? {},
      occurredAt:
        input.occurredAt?.trim() ??
        new Date().toISOString(),
    });

    return this.updateRecord(id, {
      auditTrail: [
        ...record.auditTrail,
        event,
      ],
    });
  }

  generateSafetyPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      prohibitedTopics:
        record.prohibitedTopics,
      sensitiveTopics:
        record.sensitiveTopics,
      findings: record.findings,
      controls: [
        'content-classification',
        'age-suitability-review',
        'harm-risk-detection',
        'misinformation-review',
        'hate-and-harassment-review',
        'graphic-content-review',
        'human-escalation',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateCompliancePlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      policies: record.policies,
      regulations: record.regulations,
      standards: record.standards,
      requiredDisclosures:
        record.requiredDisclosures,
      stages: [
        'jurisdiction-identification',
        'platform-policy-review',
        'legal-compliance-review',
        'privacy-review',
        'copyright-clearance',
        'disclosure-validation',
        'human-final-approval',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateRiskPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      riskProbability:
        record.riskProbability,
      riskImpact: record.riskImpact,
      residualRisk: record.residualRisk,
      risks: record.findings.map(
        (finding) => ({
          title: finding.title,
          severity: finding.severity,
          status: finding.status,
        }),
      ),
      controls: record.controls,
      remediationActions:
        record.remediationActions,
      generatedAt: new Date().toISOString(),
    };
  }

  generateAuditReport(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      recordName: record.name,
      auditEvents: record.auditTrail,
      decisions: record.decisions,
      findings: record.findings,
      evidenceFiles:
        record.evidenceFiles,
      humanApproval: {
        required:
          record.humanApprovalRequired,
        approved:
          record.humanApproved,
      },
      publishingBlocked:
        record.publishingBlocked,
      generatedAt: new Date().toISOString(),
    };
  }

  runGovernanceAssessment(id: string) {
    const record = this.getRecord(id);

    const complianceScore =
      record.contentSafetyScore * 0.17 +
      record.legalComplianceScore * 0.16 +
      record.policyComplianceScore * 0.15 +
      record.privacyScore * 0.13 +
      record.copyrightScore * 0.14 +
      record.brandSafetyScore * 0.13 +
      record.transparencyScore * 0.12;

    const riskScore =
      record.riskProbability *
      (record.riskImpact / 100);

    const criticalFindings =
      record.findings.filter(
        (finding) =>
          finding.severity === 'critical' &&
          finding.status !== 'resolved',
      ).length;

    const recommendation =
      criticalFindings > 0
        ? 'block-and-escalate'
        : complianceScore >= 90 &&
            riskScore <= 20
          ? 'ready-for-human-approval'
          : complianceScore >= 75
            ? 'remediation-required'
            : 'not-compliant';

    return {
      id: record.id,
      complianceScore: Number(
        complianceScore.toFixed(2),
      ),
      riskScore: Number(
        riskScore.toFixed(2),
      ),
      criticalFindings,
      recommendation,
      publishingBlocked:
        record.publishingBlocked ||
        criticalFindings > 0,
      assessedAt: new Date().toISOString(),
    };
  }

  getTopRiskRecords(limit = 10) {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(
      0,
      safeLimit,
    );
  }

  removeRecord(id: string) {
    this.getRecord(id);
    this.records.delete(id);

    return {
      success: true as const,
      id,
    };
  }

  private normalizeFinding(
    finding: GovernanceFinding,
  ): GovernanceFinding {
    return {
      id:
        finding.id?.trim() || randomUUID(),
      title:
        finding.title?.trim() ||
        'Untitled finding',
      description:
        finding.description?.trim() ?? '',
      category:
        finding.category?.trim() ?? 'general',
      severity:
        finding.severity ?? 'medium',
      status: finding.status ?? 'open',
      evidence: this.normalizeList(
        finding.evidence,
        false,
      ),
      recommendation:
        finding.recommendation?.trim() ?? '',
      owner:
        finding.owner?.trim() ?? '',
      createdAt:
        finding.createdAt?.trim() ??
        new Date().toISOString(),
      resolvedAt:
        finding.resolvedAt?.trim() ?? '',
    };
  }

  private normalizeDecision(
    decision: GovernanceDecision,
  ): GovernanceDecision {
    return {
      id:
        decision.id?.trim() || randomUUID(),
      decision:
        decision.decision ?? 'escalate',
      reason:
        decision.reason?.trim() ?? '',
      decidedBy:
        decision.decidedBy?.trim() ?? '',
      humanDecision:
        decision.humanDecision ?? false,
      conditions: this.normalizeList(
        decision.conditions,
        false,
      ),
      decidedAt:
        decision.decidedAt?.trim() ??
        new Date().toISOString(),
    };
  }

  private normalizeAuditEvent(
    event: GovernanceAuditEvent,
  ): GovernanceAuditEvent {
    return {
      id: event.id?.trim() || randomUUID(),
      action:
        event.action?.trim() ?? 'unknown',
      actor:
        event.actor?.trim() ?? 'system',
      entityType:
        event.entityType?.trim() ?? 'unknown',
      entityId:
        event.entityId?.trim() ?? '',
      before: event.before ?? {},
      after: event.after ?? {},
      occurredAt:
        event.occurredAt?.trim() ??
        new Date().toISOString(),
    };
  }

  private average(values: number[]) {
    if (values.length === 0) {
      return 0;
    }

    return Number(
      (
        values.reduce(
          (total, value) => total + value,
          0,
        ) / values.length
      ).toFixed(2),
    );
  }

  private score(
    value: number,
    field: string,
  ) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        `${field} must be a valid number`,
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private normalizeList(
    values?: string[],
    lowercase = true,
  ) {
    if (!values) {
      return [];
    }

    return [
      ...new Set(
        values
          .map((value) => {
            const normalized = value.trim();

            return lowercase
              ? normalized.toLowerCase()
              : normalized;
          })
          .filter(Boolean),
      ),
    ];
  }
}
