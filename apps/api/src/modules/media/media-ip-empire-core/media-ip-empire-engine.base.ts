import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type IpEmpireStage =
  | 'ip-asset-discovery'
  | 'protectable-idea-extraction'
  | 'ip-classification'
  | 'ip-digital-dna'
  | 'originality-similarity-analysis'
  | 'protectability-analysis'
  | 'evidence-timestamp-registration'
  | 'ip-family-tree'
  | 'rights-ownership-management'
  | 'strategic-value-assessment'
  | 'financial-valuation'
  | 'market-opportunity-analysis'
  | 'protection-strategy'
  | 'trademark-management'
  | 'copyright-management'
  | 'patent-management'
  | 'licensing-management'
  | 'franchise-management'
  | 'ip-productization'
  | 'ip-commercialization-distribution'
  | 'infringement-monitoring'
  | 'enforcement-dispute-resolution'
  | 'portfolio-optimization'
  | 'learning-reinvestment';

export type IpEmpireStatus =
  | 'draft'
  | 'planned'
  | 'running'
  | 'human-review'
  | 'approved'
  | 'blocked'
  | 'completed'
  | 'rejected'
  | 'archived';

export type IpAssetType =
  | 'idea'
  | 'content'
  | 'story'
  | 'character'
  | 'format'
  | 'brand'
  | 'trademark'
  | 'copyright'
  | 'patent'
  | 'design'
  | 'software'
  | 'dataset'
  | 'model'
  | 'method'
  | 'invention'
  | 'trade-secret'
  | 'franchise'
  | 'license'
  | 'other';

export type IpProtectionType =
  | 'copyright'
  | 'trademark'
  | 'patent'
  | 'design-right'
  | 'trade-secret'
  | 'contract'
  | 'defensive-publication'
  | 'domain'
  | 'unprotected';

export interface IpStageExecution {
  id: string;
  stage: IpEmpireStage;
  sequence: number;
  status: IpEmpireStatus;

  dependencies: IpEmpireStage[];
  assignedAgentIds: string[];

  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;

  qualityScore: number;
  confidenceScore: number;
  protectionScore: number;
  commercialScore: number;

  expectedRevenue: number;
  actualRevenue: number;
  cost: number;
  profit: number;

  risks: string[];
  blockers: string[];
  recommendations: string[];

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  startedAt: string;
  completedAt: string;
}

export interface IpEvidenceRecord {
  id: string;
  type:
    | 'source-file'
    | 'research'
    | 'creation-log'
    | 'version'
    | 'author-declaration'
    | 'witness'
    | 'hash'
    | 'timestamp'
    | 'contract'
    | 'registration'
    | 'other';

  title: string;
  description: string;
  reference: string;
  hash: string;

  createdBy: string;
  createdAt: string;

  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
}

export interface IpRightsRecord {
  id: string;
  ownerId: string;
  ownerName: string;

  rightType:
    | 'creator'
    | 'owner'
    | 'co-owner'
    | 'licensee'
    | 'licensor'
    | 'distributor'
    | 'publisher'
    | 'franchisee'
    | 'assignee';

  ownershipPercentage: number;

  territories: string[];
  channels: string[];
  languages: string[];

  exclusive: boolean;

  startDate: string;
  endDate: string;

  agreementReference: string;

  humanApproved: boolean;
}

export interface IpProtectionRecord {
  id: string;
  type: IpProtectionType;

  country: string;
  region: string;

  applicationNumber: string;
  registrationNumber: string;

  status:
    | 'recommended'
    | 'preparation'
    | 'filed'
    | 'examination'
    | 'registered'
    | 'rejected'
    | 'expired'
    | 'abandoned';

  filingDate: string;
  registrationDate: string;
  expiryDate: string;

  cost: number;
  strengthScore: number;

  humanApproved: boolean;
}

export interface IpLicense {
  id: string;
  name: string;

  licenseeId: string;
  licenseeName: string;

  type:
    | 'exclusive'
    | 'non-exclusive'
    | 'sole'
    | 'cross-license'
    | 'evaluation'
    | 'internal';

  territories: string[];
  channels: string[];
  languages: string[];

  upfrontFee: number;
  royaltyPercentage: number;
  minimumGuarantee: number;

  generatedRevenue: number;
  collectedRevenue: number;

  startDate: string;
  endDate: string;

  status:
    | 'draft'
    | 'negotiation'
    | 'human-review'
    | 'active'
    | 'expired'
    | 'terminated';

  humanApproved: boolean;
}

export interface IpProduct {
  id: string;
  name: string;

  type:
    | 'video'
    | 'series'
    | 'film'
    | 'book'
    | 'course'
    | 'game'
    | 'application'
    | 'software'
    | 'merchandise'
    | 'event'
    | 'subscription'
    | 'data-product'
    | 'ai-product'
    | 'franchise'
    | 'other';

  market: string;
  platform: string;

  productionCost: number;
  expectedRevenue: number;
  actualRevenue: number;
  profit: number;

  status:
    | 'concept'
    | 'validation'
    | 'development'
    | 'production'
    | 'launched'
    | 'paused'
    | 'retired';

  humanApproved: boolean;
}

export interface IpInfringementCase {
  id: string;
  title: string;

  country: string;
  platform: string;

  severity:
    | 'low'
    | 'medium'
    | 'high'
    | 'critical';

  evidenceReferences: string[];

  estimatedDamage: number;
  recoveredAmount: number;

  status:
    | 'detected'
    | 'validation'
    | 'human-review'
    | 'notice-sent'
    | 'negotiation'
    | 'legal-action'
    | 'resolved'
    | 'dismissed';

  humanApproved: boolean;

  detectedAt: string;
  resolvedAt: string;
}

export interface IpValuation {
  costApproachValue: number;
  marketApproachValue: number;
  incomeApproachValue: number;
  strategicPremium: number;
  riskDiscount: number;
  finalValuation: number;
  currency: string;
  valuationDate: string;
}

export interface IpDecision {
  id: string;
  stage: IpEmpireStage;

  title: string;
  recommendation: string;
  rationale: string;

  confidenceScore: number;
  expectedImpactScore: number;

  status:
    | 'proposed'
    | 'human-review'
    | 'approved'
    | 'rejected'
    | 'executed';

  decidedBy: string;
  decidedAt: string;

  humanApproved: boolean;
}

export interface IpAsset {
  id: string;

  name: string;
  description: string;

  type: IpAssetType;
  status: IpEmpireStatus;

  owner: string;
  creatorIds: string[];

  sourceProjectId: string;
  sourceContentId: string;
  parentAssetId: string;

  childAssetIds: string[];
  relatedAssetIds: string[];

  currentStage: IpEmpireStage;
  stages: IpStageExecution[];

  digitalDna: string;
  originalityScore: number;
  similarityRiskScore: number;
  protectabilityScore: number;
  strategicValueScore: number;
  commercialPotentialScore: number;
  legalStrengthScore: number;
  portfolioPriorityScore: number;

  valuation: IpValuation;

  evidence: IpEvidenceRecord[];
  rights: IpRightsRecord[];
  protections: IpProtectionRecord[];
  licenses: IpLicense[];
  products: IpProduct[];
  infringementCases: IpInfringementCase[];
  decisions: IpDecision[];

  targetCountries: string[];
  targetRegions: string[];
  targetLanguages: string[];
  targetPlatforms: string[];

  totalInvestment: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  reinvestmentAmount: number;

  risks: string[];
  opportunities: string[];
  recommendations: string[];
  lessons: string[];
  tags: string[];

  autonomousExecutionEnabled: boolean;
  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateIpAssetInput {
  name: string;
  description?: string;

  type?: IpAssetType;

  owner: string;
  creatorIds?: string[];

  sourceProjectId?: string;
  sourceContentId?: string;
  parentAssetId?: string;

  targetCountries?: string[];
  targetRegions?: string[];
  targetLanguages?: string[];
  targetPlatforms?: string[];

  totalInvestment?: number;
  totalRevenue?: number;
  totalCost?: number;

  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  lessons?: string[];
  tags?: string[];

  autonomousExecutionEnabled?: boolean;
  humanApprovalRequired?: boolean;
}

export abstract class MediaIpEmpireEngineBase {
  private readonly assets = new Map<string, IpAsset>();

  private readonly orderedStages: IpEmpireStage[] = [
    'ip-asset-discovery',
    'protectable-idea-extraction',
    'ip-classification',
    'ip-digital-dna',
    'originality-similarity-analysis',
    'protectability-analysis',
    'evidence-timestamp-registration',
    'ip-family-tree',
    'rights-ownership-management',
    'strategic-value-assessment',
    'financial-valuation',
    'market-opportunity-analysis',
    'protection-strategy',
    'trademark-management',
    'copyright-management',
    'patent-management',
    'licensing-management',
    'franchise-management',
    'ip-productization',
    'ip-commercialization-distribution',
    'infringement-monitoring',
    'enforcement-dispute-resolution',
    'portfolio-optimization',
    'learning-reinvestment',
  ];

  protected constructor(
    private readonly engineName: string,
    private readonly managedStage: IpEmpireStage,
  ) {}

  getDashboard() {
    const assets = [...this.assets.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      architecture: 'AVOS Media Intellectual Property Empire',
      status: 'operational' as const,

      managedStage: this.managedStage,
      totalStages: this.orderedStages.length,

      totalAssets: assets.length,

      runningAssets: assets.filter(
        (asset) => asset.status === 'running',
      ).length,

      completedAssets: assets.filter(
        (asset) => asset.status === 'completed',
      ).length,

      blockedAssets: assets.filter(
        (asset) => asset.status === 'blocked',
      ).length,

      pendingHumanApproval: assets.filter(
        (asset) =>
          asset.humanApprovalRequired &&
          !asset.humanApproved,
      ).length,

      registeredProtections: assets.reduce(
        (total, asset) =>
          total +
          asset.protections.filter(
            (protection) =>
              protection.status === 'registered',
          ).length,
        0,
      ),

      activeLicenses: assets.reduce(
        (total, asset) =>
          total +
          asset.licenses.filter(
            (license) => license.status === 'active',
          ).length,
        0,
      ),

      launchedProducts: assets.reduce(
        (total, asset) =>
          total +
          asset.products.filter(
            (product) => product.status === 'launched',
          ).length,
        0,
      ),

      openInfringementCases: assets.reduce(
        (total, asset) =>
          total +
          asset.infringementCases.filter(
            (item) =>
              item.status !== 'resolved' &&
              item.status !== 'dismissed',
          ).length,
        0,
      ),

      portfolioValuation: this.money(
        assets.reduce(
          (total, asset) =>
            total + asset.valuation.finalValuation,
          0,
        ),
      ),

      totalRevenue: this.money(
        assets.reduce(
          (total, asset) =>
            total + asset.totalRevenue,
          0,
        ),
      ),

      totalProfit: this.money(
        assets.reduce(
          (total, asset) =>
            total + asset.totalProfit,
          0,
        ),
      ),

      averagePortfolioPriorityScore: this.average(
        assets.map(
          (asset) => asset.portfolioPriorityScore,
        ),
      ),

      humanFinalAuthority: true,
      updatedAt: new Date().toISOString(),
    };
  }

  getBlueprint() {
    return {
      name: 'AVOS Media IP Empire Blueprint',
      version: '1.0.0',

      stages: this.orderedStages.map(
        (stage, index) => ({
          sequence: index + 1,
          stage,
          previousStage:
            index === 0
              ? null
              : this.orderedStages[index - 1],
          nextStage:
            index === this.orderedStages.length - 1
              ? null
              : this.orderedStages[index + 1],
          humanApprovalGate:
            this.requiresHumanApproval(stage),
        }),
      ),

      systems: [
        'ip-digital-dna',
        'ip-family-tree',
        'rights-ledger',
        'evidence-vault',
        'valuation-engine',
        'licensing-engine',
        'productization-engine',
        'infringement-radar',
        'portfolio-intelligence',
        'reinvestment-engine',
      ],

      principles: [
        'constitution-first',
        'blueprint-driven',
        'evidence-backed-ownership',
        'human-final-authority',
        'controlled-autonomy',
        'global-protection-readiness',
        'commercialization-by-design',
        'continuous-portfolio-learning',
      ],

      generatedAt: new Date().toISOString(),
    };
  }

  createAsset(input: CreateIpAssetInput): IpAsset {
    const name = input.name?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'IP asset name is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'IP asset owner is required',
      );
    }

    const now = new Date().toISOString();

    const stages: IpStageExecution[] =
      this.orderedStages.map((stage, index) => ({
        id: randomUUID(),
        stage,
        sequence: index + 1,
        status: index === 0 ? 'planned' : 'draft',
        dependencies:
          index === 0
            ? []
            : [this.orderedStages[index - 1]!],
        assignedAgentIds: [],
        inputs: {},
        outputs: {},
        qualityScore: 0,
        confidenceScore: 0,
        protectionScore: 0,
        commercialScore: 0,
        expectedRevenue: 0,
        actualRevenue: 0,
        cost: 0,
        profit: 0,
        risks: [],
        blockers: [],
        recommendations: [],
        humanApprovalRequired:
          this.requiresHumanApproval(stage),
        humanApproved: false,
        startedAt: '',
        completedAt: '',
      }));

    const revenue = this.nonNegative(
      input.totalRevenue ?? 0,
      'totalRevenue',
    );

    const cost = this.nonNegative(
      input.totalCost ?? 0,
      'totalCost',
    );

    const asset: IpAsset = {
      id: randomUUID(),

      name,
      description: input.description?.trim() ?? '',

      type: input.type ?? 'idea',
      status: 'draft',

      owner,
      creatorIds: this.normalizeList(
        input.creatorIds,
        false,
      ),

      sourceProjectId:
        input.sourceProjectId?.trim() ?? '',

      sourceContentId:
        input.sourceContentId?.trim() ?? '',

      parentAssetId:
        input.parentAssetId?.trim() ?? '',

      childAssetIds: [],
      relatedAssetIds: [],

      currentStage: 'ip-asset-discovery',
      stages,

      digitalDna: '',
      originalityScore: 0,
      similarityRiskScore: 0,
      protectabilityScore: 0,
      strategicValueScore: 0,
      commercialPotentialScore: 0,
      legalStrengthScore: 0,
      portfolioPriorityScore: 0,

      valuation: {
        costApproachValue: 0,
        marketApproachValue: 0,
        incomeApproachValue: 0,
        strategicPremium: 0,
        riskDiscount: 0,
        finalValuation: 0,
        currency: 'USD',
        valuationDate: '',
      },

      evidence: [],
      rights: [],
      protections: [],
      licenses: [],
      products: [],
      infringementCases: [],
      decisions: [],

      targetCountries: this.normalizeList(
        input.targetCountries,
      ),

      targetRegions: this.normalizeList(
        input.targetRegions,
      ),

      targetLanguages: this.normalizeList(
        input.targetLanguages,
      ),

      targetPlatforms: this.normalizeList(
        input.targetPlatforms,
      ),

      totalInvestment: this.nonNegative(
        input.totalInvestment ?? 0,
        'totalInvestment',
      ),

      totalRevenue: revenue,
      totalCost: cost,
      totalProfit: this.money(revenue - cost),
      reinvestmentAmount: 0,

      risks: this.normalizeList(
        input.risks,
        false,
      ),

      opportunities: this.normalizeList(
        input.opportunities,
        false,
      ),

      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),

      lessons: this.normalizeList(
        input.lessons,
        false,
      ),

      tags: this.normalizeList(input.tags),

      autonomousExecutionEnabled:
        input.autonomousExecutionEnabled ?? false,

      humanApprovalRequired:
        input.humanApprovalRequired ?? true,

      humanApproved: false,

      createdAt: now,
      updatedAt: now,
    };

    this.assets.set(asset.id, asset);

    return asset;
  }

  listAssets(filters?: {
    status?: IpEmpireStatus;
    type?: IpAssetType;
    stage?: IpEmpireStage;
    owner?: string;
    search?: string;
  }) {
    const search =
      filters?.search?.trim().toLowerCase();

    return [...this.assets.values()]
      .filter((asset) => {
        if (
          filters?.status &&
          asset.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.type &&
          asset.type !== filters.type
        ) {
          return false;
        }

        if (
          filters?.stage &&
          asset.currentStage !== filters.stage
        ) {
          return false;
        }

        if (
          filters?.owner &&
          asset.owner.toLowerCase() !==
            filters.owner.toLowerCase()
        ) {
          return false;
        }

        if (search) {
          const searchable = [
            asset.name,
            asset.description,
            asset.owner,
            asset.type,
            ...asset.targetCountries,
            ...asset.targetRegions,
            ...asset.targetLanguages,
            ...asset.targetPlatforms,
            ...asset.opportunities,
            ...asset.tags,
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
          second.portfolioPriorityScore -
          first.portfolioPriorityScore,
      );
  }

  getAsset(id: string) {
    const asset = this.assets.get(id);

    if (!asset) {
      throw new NotFoundException(
        `IP asset '${id}' was not found`,
      );
    }

    return asset;
  }

  updateAsset(
    id: string,
    input: Partial<IpAsset>,
  ) {
    const current = this.getAsset(id);

    const revenue =
      input.totalRevenue !== undefined
        ? this.nonNegative(
            input.totalRevenue,
            'totalRevenue',
          )
        : current.totalRevenue;

    const cost =
      input.totalCost !== undefined
        ? this.nonNegative(
            input.totalCost,
            'totalCost',
          )
        : current.totalCost;

    const updated: IpAsset = {
      ...current,
      ...input,

      id: current.id,

      name:
        input.name?.trim() ?? current.name,

      description:
        input.description?.trim() ??
        current.description,

      owner:
        input.owner?.trim() ?? current.owner,

      creatorIds:
        input.creatorIds !== undefined
          ? this.normalizeList(
              input.creatorIds,
              false,
            )
          : current.creatorIds,

      targetCountries:
        input.targetCountries !== undefined
          ? this.normalizeList(
              input.targetCountries,
            )
          : current.targetCountries,

      targetRegions:
        input.targetRegions !== undefined
          ? this.normalizeList(
              input.targetRegions,
            )
          : current.targetRegions,

      targetLanguages:
        input.targetLanguages !== undefined
          ? this.normalizeList(
              input.targetLanguages,
            )
          : current.targetLanguages,

      targetPlatforms:
        input.targetPlatforms !== undefined
          ? this.normalizeList(
              input.targetPlatforms,
            )
          : current.targetPlatforms,

      totalInvestment:
        input.totalInvestment !== undefined
          ? this.nonNegative(
              input.totalInvestment,
              'totalInvestment',
            )
          : current.totalInvestment,

      totalRevenue: revenue,
      totalCost: cost,
      totalProfit: this.money(revenue - cost),

      originalityScore:
        input.originalityScore !== undefined
          ? this.score(input.originalityScore)
          : current.originalityScore,

      similarityRiskScore:
        input.similarityRiskScore !== undefined
          ? this.score(
              input.similarityRiskScore,
            )
          : current.similarityRiskScore,

      protectabilityScore:
        input.protectabilityScore !== undefined
          ? this.score(
              input.protectabilityScore,
            )
          : current.protectabilityScore,

      strategicValueScore:
        input.strategicValueScore !== undefined
          ? this.score(
              input.strategicValueScore,
            )
          : current.strategicValueScore,

      commercialPotentialScore:
        input.commercialPotentialScore !==
        undefined
          ? this.score(
              input.commercialPotentialScore,
            )
          : current.commercialPotentialScore,

      legalStrengthScore:
        input.legalStrengthScore !== undefined
          ? this.score(
              input.legalStrengthScore,
            )
          : current.legalStrengthScore,

      portfolioPriorityScore:
        input.portfolioPriorityScore !==
        undefined
          ? this.score(
              input.portfolioPriorityScore,
            )
          : current.portfolioPriorityScore,

      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,

      opportunities:
        input.opportunities !== undefined
          ? this.normalizeList(
              input.opportunities,
              false,
            )
          : current.opportunities,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

      lessons:
        input.lessons !== undefined
          ? this.normalizeList(
              input.lessons,
              false,
            )
          : current.lessons,

      tags:
        input.tags !== undefined
          ? this.normalizeList(input.tags)
          : current.tags,

      updatedAt: new Date().toISOString(),
    };

    this.assets.set(id, updated);

    return updated;
  }

  approveAutonomousExecution(
    id: string,
    approvedBy: string,
  ) {
    const asset = this.getAsset(id);

    const decision: IpDecision = {
      id: randomUUID(),
      stage: asset.currentStage,
      title: 'Approve IP autonomous execution',
      recommendation:
        'Enable controlled IP lifecycle orchestration',
      rationale:
        'Approved by Human Final Authority',
      confidenceScore: 100,
      expectedImpactScore: 100,
      status: 'approved',
      decidedBy:
        approvedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
      humanApproved: true,
    };

    return this.updateAsset(id, {
      humanApproved: true,
      decisions: [...asset.decisions, decision],
    });
  }

  startLifecycle(id: string) {
    const asset = this.getAsset(id);

    if (
      asset.autonomousExecutionEnabled &&
      asset.humanApprovalRequired &&
      !asset.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before autonomous IP lifecycle execution',
      );
    }

    this.updateStage(id, 'ip-asset-discovery', {
      status: 'running',
      startedAt: new Date().toISOString(),
    });

    return this.updateAsset(id, {
      status: 'running',
      currentStage: 'ip-asset-discovery',
    });
  }

  executeManagedStage(
    id: string,
    input?: {
      assignedAgentIds?: string[];
      inputs?: Record<string, unknown>;
    },
  ) {
    const asset = this.getAsset(id);

    if (
      asset.currentStage !== this.managedStage
    ) {
      throw new BadRequestException(
        `Current stage is '${asset.currentStage}', not '${this.managedStage}'`,
      );
    }

    const stage = this.getStage(
      id,
      this.managedStage,
    );

    if (
      stage.humanApprovalRequired &&
      !stage.humanApproved
    ) {
      return this.submitStageForHumanReview(
        id,
        this.managedStage,
      );
    }

    this.updateStage(id, this.managedStage, {
      status: 'running',
      assignedAgentIds: [
        ...new Set(
          input?.assignedAgentIds ?? [],
        ),
      ],
      inputs: input?.inputs ?? {},
      startedAt:
        stage.startedAt ||
        new Date().toISOString(),
    });

    return this.getAsset(id);
  }

  completeManagedStage(
    id: string,
    input?: {
      outputs?: Record<string, unknown>;
      qualityScore?: number;
      confidenceScore?: number;
      protectionScore?: number;
      commercialScore?: number;
      expectedRevenue?: number;
      actualRevenue?: number;
      cost?: number;
      risks?: string[];
      recommendations?: string[];
    },
  ) {
    return this.completeStage(
      id,
      this.managedStage,
      input,
    );
  }

  completeStage(
    id: string,
    stageName: IpEmpireStage,
    input?: {
      outputs?: Record<string, unknown>;
      qualityScore?: number;
      confidenceScore?: number;
      protectionScore?: number;
      commercialScore?: number;
      expectedRevenue?: number;
      actualRevenue?: number;
      cost?: number;
      risks?: string[];
      recommendations?: string[];
    },
  ) {
    const asset = this.getAsset(id);
    const stage = this.getStage(id, stageName);

    if (
      stage.humanApprovalRequired &&
      !stage.humanApproved
    ) {
      throw new BadRequestException(
        `Human approval is required before completing '${stageName}'`,
      );
    }

    const actualRevenue = this.nonNegative(
      input?.actualRevenue ?? 0,
      'actualRevenue',
    );

    const cost = this.nonNegative(
      input?.cost ?? 0,
      'cost',
    );

    const qualityScore = this.score(
      input?.qualityScore ?? 0,
    );

    const protectionScore = this.score(
      input?.protectionScore ?? 0,
    );

    const commercialScore = this.score(
      input?.commercialScore ?? 0,
    );

    this.updateStage(id, stageName, {
      status: 'completed',
      outputs: input?.outputs ?? {},
      qualityScore,
      confidenceScore: this.score(
        input?.confidenceScore ?? 0,
      ),
      protectionScore,
      commercialScore,
      expectedRevenue: this.nonNegative(
        input?.expectedRevenue ?? 0,
        'expectedRevenue',
      ),
      actualRevenue,
      cost,
      profit: this.money(actualRevenue - cost),
      risks: this.normalizeList(
        input?.risks,
        false,
      ),
      recommendations: this.normalizeList(
        input?.recommendations,
        false,
      ),
      completedAt: new Date().toISOString(),
    });

    const index =
      this.orderedStages.indexOf(stageName);

    const nextStage =
      this.orderedStages[index + 1];

    const totalRevenue =
      asset.totalRevenue + actualRevenue;

    const totalCost =
      asset.totalCost + cost;

    if (!nextStage) {
      this.updateAsset(id, {
        status: 'completed',
        currentStage: 'learning-reinvestment',
        totalRevenue,
        totalCost,
      });

      this.recalculatePortfolioPriority(id);

      return this.getAsset(id);
    }

    this.updateStage(id, nextStage, {
      status: 'planned',
    });

    this.updateAsset(id, {
      status: 'running',
      currentStage: nextStage,
      totalRevenue,
      totalCost,
    });

    this.recalculatePortfolioPriority(id);

    return this.getAsset(id);
  }

  submitStageForHumanReview(
    id: string,
    stage: IpEmpireStage,
  ) {
    this.updateStage(id, stage, {
      status: 'human-review',
    });

    return this.updateAsset(id, {
      status: 'human-review',
      currentStage: stage,
    });
  }

  approveStage(
    id: string,
    stage: IpEmpireStage,
    approvedBy: string,
  ) {
    const asset = this.getAsset(id);

    this.updateStage(id, stage, {
      status: 'approved',
      humanApproved: true,
    });

    const decision: IpDecision = {
      id: randomUUID(),
      stage,
      title: `Approve ${stage}`,
      recommendation:
        'Proceed with the IP lifecycle stage',
      rationale:
        'Approved by Human Final Authority',
      confidenceScore: 100,
      expectedImpactScore: 100,
      status: 'approved',
      decidedBy:
        approvedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
      humanApproved: true,
    };

    return this.updateAsset(id, {
      status: 'running',
      decisions: [...asset.decisions, decision],
    });
  }

  rejectStage(
    id: string,
    stage: IpEmpireStage,
    reason: string,
    decidedBy: string,
  ) {
    const asset = this.getAsset(id);

    this.updateStage(id, stage, {
      status: 'blocked',
      blockers: [
        reason?.trim() ||
          'Rejected by Human Final Authority',
      ],
      humanApproved: false,
    });

    const decision: IpDecision = {
      id: randomUUID(),
      stage,
      title: `Reject ${stage}`,
      recommendation:
        'Return stage for remediation',
      rationale:
        reason?.trim() ||
        'Rejected by Human Final Authority',
      confidenceScore: 100,
      expectedImpactScore: 0,
      status: 'rejected',
      decidedBy:
        decidedBy?.trim() ||
        'Human Final Authority',
      decidedAt: new Date().toISOString(),
      humanApproved: false,
    };

    return this.updateAsset(id, {
      status: 'blocked',
      decisions: [...asset.decisions, decision],
    });
  }

  generateDigitalDna(id: string) {
    const asset = this.getAsset(id);

    const raw = [
      asset.id,
      asset.name,
      asset.type,
      asset.owner,
      asset.sourceProjectId,
      asset.sourceContentId,
      asset.createdAt,
    ].join('|');

    const digitalDna = Buffer.from(raw)
      .toString('base64url')
      .slice(0, 64);

    return this.updateAsset(id, {
      digitalDna,
    });
  }

  addEvidence(
    id: string,
    input: Partial<IpEvidenceRecord>,
  ) {
    const asset = this.getAsset(id);

    if (!input.title?.trim()) {
      throw new BadRequestException(
        'Evidence title is required',
      );
    }

    const evidence: IpEvidenceRecord = {
      id: randomUUID(),
      type: input.type ?? 'other',
      title: input.title.trim(),
      description:
        input.description?.trim() ?? '',
      reference:
        input.reference?.trim() ?? '',
      hash: input.hash?.trim() ?? '',
      createdBy:
        input.createdBy?.trim() ?? asset.owner,
      createdAt:
        input.createdAt ??
        new Date().toISOString(),
      verified: input.verified ?? false,
      verifiedBy:
        input.verifiedBy?.trim() ?? '',
      verifiedAt:
        input.verifiedAt ?? '',
    };

    return this.updateAsset(id, {
      evidence: [...asset.evidence, evidence],
    });
  }

  verifyEvidence(
    id: string,
    evidenceId: string,
    verifiedBy: string,
  ) {
    const asset = this.getAsset(id);

    const exists = asset.evidence.some(
      (item) => item.id === evidenceId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Evidence '${evidenceId}' was not found`,
      );
    }

    return this.updateAsset(id, {
      evidence: asset.evidence.map((item) =>
        item.id === evidenceId
          ? {
              ...item,
              verified: true,
              verifiedBy:
                verifiedBy?.trim() ||
                'Human Final Authority',
              verifiedAt:
                new Date().toISOString(),
            }
          : item,
      ),
    });
  }

  addRightsRecord(
    id: string,
    input: Partial<IpRightsRecord>,
  ) {
    const asset = this.getAsset(id);

    if (!input.ownerName?.trim()) {
      throw new BadRequestException(
        'Rights owner name is required',
      );
    }

    const ownershipPercentage = this.score(
      input.ownershipPercentage ?? 0,
    );

    const allocated = asset.rights.reduce(
      (total, right) =>
        total + right.ownershipPercentage,
      0,
    );

    if (allocated + ownershipPercentage > 100) {
      throw new BadRequestException(
        'Total ownership percentage cannot exceed 100',
      );
    }

    const right: IpRightsRecord = {
      id: randomUUID(),
      ownerId: input.ownerId?.trim() ?? '',
      ownerName: input.ownerName.trim(),
      rightType: input.rightType ?? 'owner',
      ownershipPercentage,
      territories: this.normalizeList(
        input.territories,
      ),
      channels: this.normalizeList(
        input.channels,
      ),
      languages: this.normalizeList(
        input.languages,
      ),
      exclusive: input.exclusive ?? false,
      startDate: input.startDate ?? '',
      endDate: input.endDate ?? '',
      agreementReference:
        input.agreementReference?.trim() ?? '',
      humanApproved:
        input.humanApproved ?? false,
    };

    return this.updateAsset(id, {
      rights: [...asset.rights, right],
    });
  }

  approveRightsRecord(
    id: string,
    rightsId: string,
  ) {
    const asset = this.getAsset(id);

    this.ensureExists(
      asset.rights,
      rightsId,
      'Rights record',
    );

    return this.updateAsset(id, {
      rights: asset.rights.map((item) =>
        item.id === rightsId
          ? {
              ...item,
              humanApproved: true,
            }
          : item,
      ),
    });
  }

  addProtection(
    id: string,
    input: Partial<IpProtectionRecord>,
  ) {
    const asset = this.getAsset(id);

    const protection: IpProtectionRecord = {
      id: randomUUID(),
      type: input.type ?? 'unprotected',
      country: input.country?.trim() ?? '',
      region: input.region?.trim() ?? '',
      applicationNumber:
        input.applicationNumber?.trim() ?? '',
      registrationNumber:
        input.registrationNumber?.trim() ?? '',
      status: input.status ?? 'recommended',
      filingDate: input.filingDate ?? '',
      registrationDate:
        input.registrationDate ?? '',
      expiryDate: input.expiryDate ?? '',
      cost: this.nonNegative(
        input.cost ?? 0,
        'protection cost',
      ),
      strengthScore: this.score(
        input.strengthScore ?? 0,
      ),
      humanApproved:
        input.humanApproved ?? false,
    };

    return this.updateAsset(id, {
      protections: [
        ...asset.protections,
        protection,
      ],
    });
  }

  approveProtection(
    id: string,
    protectionId: string,
  ) {
    const asset = this.getAsset(id);

    this.ensureExists(
      asset.protections,
      protectionId,
      'Protection record',
    );

    return this.updateAsset(id, {
      protections: asset.protections.map(
        (item) =>
          item.id === protectionId
            ? {
                ...item,
                humanApproved: true,
              }
            : item,
      ),
    });
  }

  calculateValuation(
    id: string,
    input: Partial<IpValuation>,
  ) {
    const asset = this.getAsset(id);

    const costApproachValue = this.nonNegative(
      input.costApproachValue ?? 0,
      'costApproachValue',
    );

    const marketApproachValue =
      this.nonNegative(
        input.marketApproachValue ?? 0,
        'marketApproachValue',
      );

    const incomeApproachValue =
      this.nonNegative(
        input.incomeApproachValue ?? 0,
        'incomeApproachValue',
      );

    const strategicPremium = this.nonNegative(
      input.strategicPremium ?? 0,
      'strategicPremium',
    );

    const riskDiscount = this.nonNegative(
      input.riskDiscount ?? 0,
      'riskDiscount',
    );

    const base =
      costApproachValue * 0.2 +
      marketApproachValue * 0.35 +
      incomeApproachValue * 0.45;

    const finalValuation = this.money(
      Math.max(
        0,
        base + strategicPremium - riskDiscount,
      ),
    );

    return this.updateAsset(id, {
      valuation: {
        costApproachValue,
        marketApproachValue,
        incomeApproachValue,
        strategicPremium,
        riskDiscount,
        finalValuation,
        currency:
          input.currency?.trim() ||
          asset.valuation.currency ||
          'USD',
        valuationDate:
          new Date().toISOString(),
      },
    });
  }

  addLicense(
    id: string,
    input: Partial<IpLicense>,
  ) {
    const asset = this.getAsset(id);

    if (!input.name?.trim()) {
      throw new BadRequestException(
        'License name is required',
      );
    }

    const generatedRevenue =
      this.nonNegative(
        input.generatedRevenue ?? 0,
        'generatedRevenue',
      );

    const collectedRevenue =
      this.nonNegative(
        input.collectedRevenue ?? 0,
        'collectedRevenue',
      );

    const license: IpLicense = {
      id: randomUUID(),
      name: input.name.trim(),
      licenseeId:
        input.licenseeId?.trim() ?? '',
      licenseeName:
        input.licenseeName?.trim() ?? '',
      type: input.type ?? 'non-exclusive',
      territories: this.normalizeList(
        input.territories,
      ),
      channels: this.normalizeList(
        input.channels,
      ),
      languages: this.normalizeList(
        input.languages,
      ),
      upfrontFee: this.nonNegative(
        input.upfrontFee ?? 0,
        'upfrontFee',
      ),
      royaltyPercentage: this.score(
        input.royaltyPercentage ?? 0,
      ),
      minimumGuarantee: this.nonNegative(
        input.minimumGuarantee ?? 0,
        'minimumGuarantee',
      ),
      generatedRevenue,
      collectedRevenue,
      startDate: input.startDate ?? '',
      endDate: input.endDate ?? '',
      status: input.status ?? 'draft',
      humanApproved:
        input.humanApproved ?? false,
    };

    return this.updateAsset(id, {
      licenses: [...asset.licenses, license],
      totalRevenue:
        asset.totalRevenue + collectedRevenue,
    });
  }

  approveLicense(
    id: string,
    licenseId: string,
  ) {
    const asset = this.getAsset(id);

    this.ensureExists(
      asset.licenses,
      licenseId,
      'License',
    );

    return this.updateAsset(id, {
      licenses: asset.licenses.map((item) =>
        item.id === licenseId
          ? {
              ...item,
              status: 'active',
              humanApproved: true,
            }
          : item,
      ),
    });
  }

  addProduct(
    id: string,
    input: Partial<IpProduct>,
  ) {
    const asset = this.getAsset(id);

    if (!input.name?.trim()) {
      throw new BadRequestException(
        'IP product name is required',
      );
    }

    const productionCost = this.nonNegative(
      input.productionCost ?? 0,
      'productionCost',
    );

    const actualRevenue = this.nonNegative(
      input.actualRevenue ?? 0,
      'actualRevenue',
    );

    const product: IpProduct = {
      id: randomUUID(),
      name: input.name.trim(),
      type: input.type ?? 'other',
      market: input.market?.trim() ?? '',
      platform: input.platform?.trim() ?? '',
      productionCost,
      expectedRevenue: this.nonNegative(
        input.expectedRevenue ?? 0,
        'expectedRevenue',
      ),
      actualRevenue,
      profit: this.money(
        actualRevenue - productionCost,
      ),
      status: input.status ?? 'concept',
      humanApproved:
        input.humanApproved ?? false,
    };

    return this.updateAsset(id, {
      products: [...asset.products, product],
      totalRevenue:
        asset.totalRevenue + actualRevenue,
      totalCost:
        asset.totalCost + productionCost,
    });
  }

  approveProduct(
    id: string,
    productId: string,
  ) {
    const asset = this.getAsset(id);

    this.ensureExists(
      asset.products,
      productId,
      'Product',
    );

    return this.updateAsset(id, {
      products: asset.products.map((item) =>
        item.id === productId
          ? {
              ...item,
              humanApproved: true,
            }
          : item,
      ),
    });
  }

  addInfringementCase(
    id: string,
    input: Partial<IpInfringementCase>,
  ) {
    const asset = this.getAsset(id);

    if (!input.title?.trim()) {
      throw new BadRequestException(
        'Infringement case title is required',
      );
    }

    const infringementCase: IpInfringementCase = {
      id: randomUUID(),
      title: input.title.trim(),
      country: input.country?.trim() ?? '',
      platform: input.platform?.trim() ?? '',
      severity: input.severity ?? 'medium',
      evidenceReferences:
        this.normalizeList(
          input.evidenceReferences,
          false,
        ),
      estimatedDamage: this.nonNegative(
        input.estimatedDamage ?? 0,
        'estimatedDamage',
      ),
      recoveredAmount: this.nonNegative(
        input.recoveredAmount ?? 0,
        'recoveredAmount',
      ),
      status: input.status ?? 'detected',
      humanApproved:
        input.humanApproved ?? false,
      detectedAt:
        input.detectedAt ??
        new Date().toISOString(),
      resolvedAt: input.resolvedAt ?? '',
    };

    return this.updateAsset(id, {
      infringementCases: [
        ...asset.infringementCases,
        infringementCase,
      ],
    });
  }

  approveEnforcement(
    id: string,
    caseId: string,
  ) {
    const asset = this.getAsset(id);

    this.ensureExists(
      asset.infringementCases,
      caseId,
      'Infringement case',
    );

    return this.updateAsset(id, {
      infringementCases:
        asset.infringementCases.map((item) =>
          item.id === caseId
            ? {
                ...item,
                status: 'legal-action',
                humanApproved: true,
              }
            : item,
        ),
    });
  }

  linkChildAsset(
    parentId: string,
    childId: string,
  ) {
    const parent = this.getAsset(parentId);
    const child = this.getAsset(childId);

    this.updateAsset(parentId, {
      childAssetIds: [
        ...new Set([
          ...parent.childAssetIds,
          childId,
        ]),
      ],
    });

    this.updateAsset(childId, {
      parentAssetId: parentId,
      relatedAssetIds: [
        ...new Set([
          ...child.relatedAssetIds,
          parentId,
        ]),
      ],
    });

    return {
      parent: this.getAsset(parentId),
      child: this.getAsset(childId),
    };
  }

  calculateReinvestment(
    id: string,
    percentage: number,
  ) {
    const asset = this.getAsset(id);

    if (
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      throw new BadRequestException(
        'Reinvestment percentage must be between 0 and 100',
      );
    }

    const reinvestmentAmount = this.money(
      Math.max(0, asset.totalProfit) *
        (percentage / 100),
    );

    return this.updateAsset(id, {
      reinvestmentAmount,
    });
  }

  getPortfolioRanking() {
    return [...this.assets.values()].sort(
      (first, second) =>
        second.portfolioPriorityScore -
        first.portfolioPriorityScore,
    );
  }

  generateCommercializationPlan(id: string) {
    const asset = this.getAsset(id);

    return {
      assetId: asset.id,
      assetName: asset.name,

      readiness: {
        originalityScore:
          asset.originalityScore,
        protectabilityScore:
          asset.protectabilityScore,
        legalStrengthScore:
          asset.legalStrengthScore,
        commercialPotentialScore:
          asset.commercialPotentialScore,
      },

      recommendedModels: [
        'direct-product-sales',
        'subscription',
        'content-licensing',
        'regional-licensing',
        'format-licensing',
        'franchise',
        'merchandising',
        'publishing',
        'software-as-a-service',
        'data-licensing',
        'strategic-partnership',
      ],

      targetCountries: asset.targetCountries,
      targetLanguages: asset.targetLanguages,
      targetPlatforms: asset.targetPlatforms,

      protections: asset.protections,
      products: asset.products,
      licenses: asset.licenses,

      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateProtectionPlan(id: string) {
    const asset = this.getAsset(id);

    const recommendedProtectionTypes =
      this.getRecommendedProtectionTypes(
        asset.type,
      );

    return {
      assetId: asset.id,
      assetType: asset.type,
      recommendedProtectionTypes,
      targetCountries: asset.targetCountries,
      targetRegions: asset.targetRegions,
      evidenceReadinessScore:
        this.evidenceReadinessScore(asset),
      ownershipReadinessScore:
        this.ownershipReadinessScore(asset),
      existingProtections: asset.protections,
      humanApprovalRequired: true,
      generatedAt: new Date().toISOString(),
    };
  }

  generateIpReport(id: string) {
    const asset = this.getAsset(id);

    const completedStages =
      asset.stages.filter(
        (stage) => stage.status === 'completed',
      ).length;

    return {
      asset,

      progressPercentage: Number(
        (
          (completedStages /
            this.orderedStages.length) *
          100
        ).toFixed(2),
      ),

      completedStages,
      totalStages: this.orderedStages.length,

      evidenceReadinessScore:
        this.evidenceReadinessScore(asset),

      ownershipReadinessScore:
        this.ownershipReadinessScore(asset),

      protectionCoverageScore:
        this.protectionCoverageScore(asset),

      financialPerformance: {
        valuation:
          asset.valuation.finalValuation,
        investment: asset.totalInvestment,
        revenue: asset.totalRevenue,
        cost: asset.totalCost,
        profit: asset.totalProfit,
        reinvestment:
          asset.reinvestmentAmount,
        returnOnInvestment:
          asset.totalCost > 0
            ? Number(
                (
                  (asset.totalProfit /
                    asset.totalCost) *
                  100
                ).toFixed(2),
              )
            : asset.totalRevenue > 0
              ? 100
              : 0,
      },

      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  removeAsset(id: string) {
    this.getAsset(id);
    this.assets.delete(id);

    return {
      success: true as const,
      id,
    };
  }

  private getStage(
    id: string,
    stage: IpEmpireStage,
  ) {
    const asset = this.getAsset(id);

    const execution = asset.stages.find(
      (item) => item.stage === stage,
    );

    if (!execution) {
      throw new NotFoundException(
        `IP stage '${stage}' was not found`,
      );
    }

    return execution;
  }

  private updateStage(
    id: string,
    stage: IpEmpireStage,
    input: Partial<IpStageExecution>,
  ) {
    const asset = this.getAsset(id);

    return this.updateAsset(id, {
      stages: asset.stages.map((execution) =>
        execution.stage === stage
          ? {
              ...execution,
              ...input,
              id: execution.id,
              stage: execution.stage,
              sequence: execution.sequence,
            }
          : execution,
      ),
    });
  }

  private recalculatePortfolioPriority(
    id: string,
  ) {
    const asset = this.getAsset(id);

    const portfolioPriorityScore =
      asset.originalityScore * 0.12 +
      asset.protectabilityScore * 0.16 +
      asset.strategicValueScore * 0.16 +
      asset.commercialPotentialScore * 0.22 +
      asset.legalStrengthScore * 0.14 +
      this.protectionCoverageScore(asset) *
        0.1 +
      Math.min(
        100,
        asset.valuation.finalValuation > 0
          ? 70
          : 0,
      ) *
        0.1;

    return this.updateAsset(id, {
      portfolioPriorityScore: Number(
        portfolioPriorityScore.toFixed(2),
      ),
    });
  }

  private requiresHumanApproval(
    stage: IpEmpireStage,
  ) {
    return [
      'rights-ownership-management',
      'protection-strategy',
      'trademark-management',
      'copyright-management',
      'patent-management',
      'licensing-management',
      'franchise-management',
      'enforcement-dispute-resolution',
      'learning-reinvestment',
    ].includes(stage);
  }

  private evidenceReadinessScore(
    asset: IpAsset,
  ) {
    if (asset.evidence.length === 0) {
      return 0;
    }

    const verified =
      asset.evidence.filter(
        (item) => item.verified,
      ).length;

    return Number(
      (
        (verified / asset.evidence.length) *
        100
      ).toFixed(2),
    );
  }

  private ownershipReadinessScore(
    asset: IpAsset,
  ) {
    if (asset.rights.length === 0) {
      return 0;
    }

    const approvedOwnership =
      asset.rights
        .filter(
          (item) => item.humanApproved,
        )
        .reduce(
          (total, item) =>
            total + item.ownershipPercentage,
          0,
        );

    return this.score(approvedOwnership);
  }

  private protectionCoverageScore(
    asset: IpAsset,
  ) {
    if (
      asset.targetCountries.length === 0 &&
      asset.protections.length === 0
    ) {
      return 0;
    }

    const registeredCountries = new Set(
      asset.protections
        .filter(
          (item) =>
            item.status === 'registered',
        )
        .map((item) =>
          item.country.toLowerCase(),
        )
        .filter(Boolean),
    );

    if (asset.targetCountries.length === 0) {
      return registeredCountries.size > 0
        ? 100
        : 0;
    }

    const covered =
      asset.targetCountries.filter((country) =>
        registeredCountries.has(
          country.toLowerCase(),
        ),
      ).length;

    return Number(
      (
        (covered /
          asset.targetCountries.length) *
        100
      ).toFixed(2),
    );
  }

  private getRecommendedProtectionTypes(
    type: IpAssetType,
  ): IpProtectionType[] {
    switch (type) {
      case 'brand':
      case 'trademark':
        return [
          'trademark',
          'copyright',
          'domain',
          'contract',
        ];

      case 'invention':
      case 'patent':
      case 'method':
        return [
          'patent',
          'trade-secret',
          'contract',
          'defensive-publication',
        ];

      case 'design':
        return [
          'design-right',
          'copyright',
          'trademark',
        ];

      case 'software':
      case 'model':
      case 'dataset':
        return [
          'copyright',
          'trade-secret',
          'contract',
          'patent',
        ];

      case 'story':
      case 'character':
      case 'content':
      case 'format':
        return [
          'copyright',
          'trademark',
          'contract',
        ];

      default:
        return [
          'copyright',
          'contract',
          'trade-secret',
        ];
    }
  }

  private ensureExists(
    records: Array<{ id: string }>,
    id: string,
    entityName: string,
  ) {
    if (
      !records.some((record) => record.id === id)
    ) {
      throw new NotFoundException(
        `${entityName} '${id}' was not found`,
      );
    }
  }

  private score(value: number) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        'Score must be a valid number',
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private nonNegative(
    value: number,
    field: string,
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new BadRequestException(
        `${field} must be zero or greater`,
      );
    }

    return this.money(value);
  }

  private money(value: number) {
    return Number(value.toFixed(2));
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
