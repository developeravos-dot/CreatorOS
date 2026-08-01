import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MediaIpStatus =
  | 'draft'
  | 'discovered'
  | 'evaluating'
  | 'protected'
  | 'developing'
  | 'licensing'
  | 'expanding'
  | 'human-review'
  | 'approved'
  | 'active'
  | 'retired'
  | 'rejected'
  | 'archived';

export type MediaIpPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MediaIpType =
  | 'content-ip'
  | 'format-ip'
  | 'character-ip'
  | 'story-world'
  | 'brand-ip'
  | 'franchise'
  | 'catalog'
  | 'licensing-right'
  | 'other';

export interface IpFamilyNode {
  id: string;
  parentId: string;
  name: string;
  type: MediaIpType;
  relationship:
    | 'origin'
    | 'adaptation'
    | 'sequel'
    | 'prequel'
    | 'spin-off'
    | 'translation'
    | 'regional-version'
    | 'product-extension'
    | 'licensed-version'
    | 'other';
  status:
    | 'planned'
    | 'developing'
    | 'active'
    | 'retired';
  createdAt: string;
}

export interface MediaIpRight {
  id: string;
  rightType:
    | 'copyright'
    | 'trademark'
    | 'format-right'
    | 'distribution-right'
    | 'translation-right'
    | 'adaptation-right'
    | 'merchandising-right'
    | 'music-right'
    | 'character-right'
    | 'other';
  territory: string;
  language: string;
  owner: string;
  licensee: string;
  exclusive: boolean;
  startAt: string;
  endAt: string;
  status:
    | 'draft'
    | 'registered'
    | 'licensed'
    | 'expired'
    | 'disputed';
}

export interface MediaIpAsset {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: MediaIpType;
  status: MediaIpStatus;
  priority: MediaIpPriority;

  owner: string;
  creator: string;
  projectId: string;
  contentId: string;
  productionId: string;

  title: string;
  originalTitle: string;
  universeName: string;
  franchiseName: string;
  digitalDna: string;

  language: string;
  originCountry: string;
  targetMarkets: string[];
  platforms: string[];
  audiences: string[];

  characters: string[];
  locations: string[];
  themes: string[];
  storyRules: string[];
  visualRules: string[];
  audioRules: string[];
  brandRules: string[];

  familyTree: IpFamilyNode[];
  rights: MediaIpRight[];

  registrationNumbers: string[];
  evidenceFiles: string[];
  sourceFiles: string[];
  contracts: string[];

  estimatedValue: number;
  licensingRevenue: number;
  royaltyRevenue: number;
  merchandiseRevenue: number;
  adaptationRevenue: number;
  protectionCost: number;
  developmentCost: number;

  originalityScore: number;
  ownershipClarityScore: number;
  protectionScore: number;
  licensingPotentialScore: number;
  franchisePotentialScore: number;
  globalExpansionScore: number;
  commercialValueScore: number;
  strategicValueScore: number;

  risks: string[];
  disputes: string[];
  recommendations: string[];
  expansionOpportunities: string[];
  tags: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaIpAssetInput {
  name: string;
  description?: string;
  category: string;
  type?: MediaIpType;
  status?: MediaIpStatus;
  priority?: MediaIpPriority;

  owner: string;
  creator?: string;
  projectId?: string;
  contentId?: string;
  productionId?: string;

  title?: string;
  originalTitle?: string;
  universeName?: string;
  franchiseName?: string;
  digitalDna?: string;

  language?: string;
  originCountry?: string;
  targetMarkets?: string[];
  platforms?: string[];
  audiences?: string[];

  characters?: string[];
  locations?: string[];
  themes?: string[];
  storyRules?: string[];
  visualRules?: string[];
  audioRules?: string[];
  brandRules?: string[];

  familyTree?: IpFamilyNode[];
  rights?: MediaIpRight[];

  registrationNumbers?: string[];
  evidenceFiles?: string[];
  sourceFiles?: string[];
  contracts?: string[];

  estimatedValue?: number;
  licensingRevenue?: number;
  royaltyRevenue?: number;
  merchandiseRevenue?: number;
  adaptationRevenue?: number;
  protectionCost?: number;
  developmentCost?: number;

  originalityScore?: number;
  ownershipClarityScore?: number;
  protectionScore?: number;
  licensingPotentialScore?: number;
  franchisePotentialScore?: number;
  globalExpansionScore?: number;
  commercialValueScore?: number;
  strategicValueScore?: number;

  risks?: string[];
  disputes?: string[];
  recommendations?: string[];
  expansionOpportunities?: string[];
  tags?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaIpAssetInput
  extends Partial<CreateMediaIpAssetInput> {}

export abstract class MediaIpFranchiseEngineBase {
  private readonly records =
    new Map<string, MediaIpAsset>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const records = [...this.records.values()];

    const totalRevenue = records.reduce(
      (total, record) =>
        total +
        record.licensingRevenue +
        record.royaltyRevenue +
        record.merchandiseRevenue +
        record.adaptationRevenue,
      0,
    );

    const totalCost = records.reduce(
      (total, record) =>
        total +
        record.protectionCost +
        record.developmentCost,
      0,
    );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media Intellectual Property Franchise and Asset Expansion',
      humanFinalAuthority: true,

      totalAssets: records.length,

      protectedAssets: records.filter(
        (record) => record.status === 'protected',
      ).length,

      licensingAssets: records.filter(
        (record) => record.status === 'licensing',
      ).length,

      expandingAssets: records.filter(
        (record) => record.status === 'expanding',
      ).length,

      activeAssets: records.filter(
        (record) => record.status === 'active',
      ).length,

      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,

      totalEstimatedValue: Number(
        records
          .reduce(
            (total, record) =>
              total + record.estimatedValue,
            0,
          )
          .toFixed(2),
      ),

      totalRevenue: Number(
        totalRevenue.toFixed(2),
      ),

      totalCost: Number(
        totalCost.toFixed(2),
      ),

      totalNetValue: Number(
        (totalRevenue - totalCost).toFixed(2),
      ),

      averageProtectionScore: this.average(
        records.map(
          (record) => record.protectionScore,
        ),
      ),

      averageFranchisePotentialScore:
        this.average(
          records.map(
            (record) =>
              record.franchisePotentialScore,
          ),
        ),

      averageStrategicValueScore: this.average(
        records.map(
          (record) =>
            record.strategicValueScore,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaIpAssetInput,
  ): MediaIpAsset {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'IP asset name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'IP asset category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'IP asset owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaIpAsset = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      type: input.type ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',

      owner,
      creator:
        input.creator?.trim() ?? owner,
      projectId:
        input.projectId?.trim() ?? '',
      contentId:
        input.contentId?.trim() ?? '',
      productionId:
        input.productionId?.trim() ?? '',

      title:
        input.title?.trim() ?? name,
      originalTitle:
        input.originalTitle?.trim() ??
        input.title?.trim() ??
        name,
      universeName:
        input.universeName?.trim() ?? '',
      franchiseName:
        input.franchiseName?.trim() ?? '',
      digitalDna:
        input.digitalDna?.trim() ??
        this.generateDigitalDna(name),

      language:
        input.language?.trim().toLowerCase() ??
        'en',
      originCountry:
        input.originCountry
          ?.trim()
          .toLowerCase() ?? 'global',

      targetMarkets: this.normalizeList(
        input.targetMarkets,
      ),
      platforms: this.normalizeList(
        input.platforms,
      ),
      audiences: this.normalizeList(
        input.audiences,
        false,
      ),

      characters: this.normalizeList(
        input.characters,
        false,
      ),
      locations: this.normalizeList(
        input.locations,
        false,
      ),
      themes: this.normalizeList(
        input.themes,
      ),
      storyRules: this.normalizeList(
        input.storyRules,
        false,
      ),
      visualRules: this.normalizeList(
        input.visualRules,
        false,
      ),
      audioRules: this.normalizeList(
        input.audioRules,
        false,
      ),
      brandRules: this.normalizeList(
        input.brandRules,
        false,
      ),

      familyTree:
        input.familyTree?.map((node) =>
          this.normalizeFamilyNode(node),
        ) ?? [],

      rights:
        input.rights?.map((right) =>
          this.normalizeRight(right),
        ) ?? [],

      registrationNumbers:
        this.normalizeList(
          input.registrationNumbers,
          false,
        ),

      evidenceFiles: this.normalizeList(
        input.evidenceFiles,
        false,
      ),

      sourceFiles: this.normalizeList(
        input.sourceFiles,
        false,
      ),

      contracts: this.normalizeList(
        input.contracts,
        false,
      ),

      estimatedValue: this.nonNegativeNumber(
        input.estimatedValue ?? 0,
        'estimatedValue',
      ),

      licensingRevenue:
        this.nonNegativeNumber(
          input.licensingRevenue ?? 0,
          'licensingRevenue',
        ),

      royaltyRevenue: this.nonNegativeNumber(
        input.royaltyRevenue ?? 0,
        'royaltyRevenue',
      ),

      merchandiseRevenue:
        this.nonNegativeNumber(
          input.merchandiseRevenue ?? 0,
          'merchandiseRevenue',
        ),

      adaptationRevenue:
        this.nonNegativeNumber(
          input.adaptationRevenue ?? 0,
          'adaptationRevenue',
        ),

      protectionCost: this.nonNegativeNumber(
        input.protectionCost ?? 0,
        'protectionCost',
      ),

      developmentCost:
        this.nonNegativeNumber(
          input.developmentCost ?? 0,
          'developmentCost',
        ),

      originalityScore: this.score(
        input.originalityScore ?? 0,
        'originalityScore',
      ),

      ownershipClarityScore: this.score(
        input.ownershipClarityScore ?? 0,
        'ownershipClarityScore',
      ),

      protectionScore: this.score(
        input.protectionScore ?? 0,
        'protectionScore',
      ),

      licensingPotentialScore: this.score(
        input.licensingPotentialScore ?? 0,
        'licensingPotentialScore',
      ),

      franchisePotentialScore: this.score(
        input.franchisePotentialScore ?? 0,
        'franchisePotentialScore',
      ),

      globalExpansionScore: this.score(
        input.globalExpansionScore ?? 0,
        'globalExpansionScore',
      ),

      commercialValueScore: this.score(
        input.commercialValueScore ?? 0,
        'commercialValueScore',
      ),

      strategicValueScore: this.score(
        input.strategicValueScore ?? 0,
        'strategicValueScore',
      ),

      risks: this.normalizeList(
        input.risks,
        false,
      ),

      disputes: this.normalizeList(
        input.disputes,
        false,
      ),

      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),

      expansionOpportunities:
        this.normalizeList(
          input.expansionOpportunities,
          false,
        ),

      tags: this.normalizeList(input.tags),

      metadata: input.metadata ?? {},

      humanApprovalRequired:
        input.humanApprovalRequired ?? true,

      humanApproved:
        input.humanApproved ?? false,

      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: MediaIpStatus;
    priority?: MediaIpPriority;
    type?: MediaIpType;
    category?: string;
    owner?: string;
    language?: string;
    market?: string;
    search?: string;
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
          filters?.category &&
          record.category !== filters.category
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
          filters?.language &&
          record.language !==
            filters.language.toLowerCase()
        ) {
          return false;
        }

        if (
          filters?.market &&
          !record.targetMarkets.includes(
            filters.market.toLowerCase(),
          )
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
            record.creator,
            record.title,
            record.originalTitle,
            record.universeName,
            record.franchiseName,
            record.digitalDna,
            ...record.targetMarkets,
            ...record.platforms,
            ...record.audiences,
            ...record.characters,
            ...record.locations,
            ...record.themes,
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
          second.strategicValueScore -
          first.strategicValueScore,
      );
  }

  getRecord(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `${this.engineName} asset '${id}' was not found`,
      );
    }

    return record;
  }

  updateRecord(
    id: string,
    input: UpdateMediaIpAssetInput,
  ) {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'IP asset name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'IP asset owner cannot be empty',
      );
    }

    const updated: MediaIpAsset = {
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

      creator:
        input.creator?.trim() ??
        current.creator,

      projectId:
        input.projectId?.trim() ??
        current.projectId,

      contentId:
        input.contentId?.trim() ??
        current.contentId,

      productionId:
        input.productionId?.trim() ??
        current.productionId,

      title:
        input.title?.trim() ?? current.title,

      originalTitle:
        input.originalTitle?.trim() ??
        current.originalTitle,

      universeName:
        input.universeName?.trim() ??
        current.universeName,

      franchiseName:
        input.franchiseName?.trim() ??
        current.franchiseName,

      digitalDna:
        input.digitalDna?.trim() ??
        current.digitalDna,

      language:
        input.language?.trim().toLowerCase() ??
        current.language,

      originCountry:
        input.originCountry
          ?.trim()
          .toLowerCase() ??
        current.originCountry,

      targetMarkets:
        input.targetMarkets !== undefined
          ? this.normalizeList(
              input.targetMarkets,
            )
          : current.targetMarkets,

      platforms:
        input.platforms !== undefined
          ? this.normalizeList(
              input.platforms,
            )
          : current.platforms,

      audiences:
        input.audiences !== undefined
          ? this.normalizeList(
              input.audiences,
              false,
            )
          : current.audiences,

      characters:
        input.characters !== undefined
          ? this.normalizeList(
              input.characters,
              false,
            )
          : current.characters,

      locations:
        input.locations !== undefined
          ? this.normalizeList(
              input.locations,
              false,
            )
          : current.locations,

      themes:
        input.themes !== undefined
          ? this.normalizeList(input.themes)
          : current.themes,

      storyRules:
        input.storyRules !== undefined
          ? this.normalizeList(
              input.storyRules,
              false,
            )
          : current.storyRules,

      visualRules:
        input.visualRules !== undefined
          ? this.normalizeList(
              input.visualRules,
              false,
            )
          : current.visualRules,

      audioRules:
        input.audioRules !== undefined
          ? this.normalizeList(
              input.audioRules,
              false,
            )
          : current.audioRules,

      brandRules:
        input.brandRules !== undefined
          ? this.normalizeList(
              input.brandRules,
              false,
            )
          : current.brandRules,

      familyTree:
        input.familyTree !== undefined
          ? input.familyTree.map((node) =>
              this.normalizeFamilyNode(node),
            )
          : current.familyTree,

      rights:
        input.rights !== undefined
          ? input.rights.map((right) =>
              this.normalizeRight(right),
            )
          : current.rights,

      registrationNumbers:
        input.registrationNumbers !==
        undefined
          ? this.normalizeList(
              input.registrationNumbers,
              false,
            )
          : current.registrationNumbers,

      evidenceFiles:
        input.evidenceFiles !== undefined
          ? this.normalizeList(
              input.evidenceFiles,
              false,
            )
          : current.evidenceFiles,

      sourceFiles:
        input.sourceFiles !== undefined
          ? this.normalizeList(
              input.sourceFiles,
              false,
            )
          : current.sourceFiles,

      contracts:
        input.contracts !== undefined
          ? this.normalizeList(
              input.contracts,
              false,
            )
          : current.contracts,

      estimatedValue:
        input.estimatedValue !== undefined
          ? this.nonNegativeNumber(
              input.estimatedValue,
              'estimatedValue',
            )
          : current.estimatedValue,

      licensingRevenue:
        input.licensingRevenue !== undefined
          ? this.nonNegativeNumber(
              input.licensingRevenue,
              'licensingRevenue',
            )
          : current.licensingRevenue,

      royaltyRevenue:
        input.royaltyRevenue !== undefined
          ? this.nonNegativeNumber(
              input.royaltyRevenue,
              'royaltyRevenue',
            )
          : current.royaltyRevenue,

      merchandiseRevenue:
        input.merchandiseRevenue !== undefined
          ? this.nonNegativeNumber(
              input.merchandiseRevenue,
              'merchandiseRevenue',
            )
          : current.merchandiseRevenue,

      adaptationRevenue:
        input.adaptationRevenue !== undefined
          ? this.nonNegativeNumber(
              input.adaptationRevenue,
              'adaptationRevenue',
            )
          : current.adaptationRevenue,

      protectionCost:
        input.protectionCost !== undefined
          ? this.nonNegativeNumber(
              input.protectionCost,
              'protectionCost',
            )
          : current.protectionCost,

      developmentCost:
        input.developmentCost !== undefined
          ? this.nonNegativeNumber(
              input.developmentCost,
              'developmentCost',
            )
          : current.developmentCost,

      originalityScore:
        input.originalityScore !== undefined
          ? this.score(
              input.originalityScore,
              'originalityScore',
            )
          : current.originalityScore,

      ownershipClarityScore:
        input.ownershipClarityScore !==
        undefined
          ? this.score(
              input.ownershipClarityScore,
              'ownershipClarityScore',
            )
          : current.ownershipClarityScore,

      protectionScore:
        input.protectionScore !== undefined
          ? this.score(
              input.protectionScore,
              'protectionScore',
            )
          : current.protectionScore,

      licensingPotentialScore:
        input.licensingPotentialScore !==
        undefined
          ? this.score(
              input.licensingPotentialScore,
              'licensingPotentialScore',
            )
          : current.licensingPotentialScore,

      franchisePotentialScore:
        input.franchisePotentialScore !==
        undefined
          ? this.score(
              input.franchisePotentialScore,
              'franchisePotentialScore',
            )
          : current.franchisePotentialScore,

      globalExpansionScore:
        input.globalExpansionScore !==
        undefined
          ? this.score(
              input.globalExpansionScore,
              'globalExpansionScore',
            )
          : current.globalExpansionScore,

      commercialValueScore:
        input.commercialValueScore !==
        undefined
          ? this.score(
              input.commercialValueScore,
              'commercialValueScore',
            )
          : current.commercialValueScore,

      strategicValueScore:
        input.strategicValueScore !== undefined
          ? this.score(
              input.strategicValueScore,
              'strategicValueScore',
            )
          : current.strategicValueScore,

      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,

      disputes:
        input.disputes !== undefined
          ? this.normalizeList(
              input.disputes,
              false,
            )
          : current.disputes,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

      expansionOpportunities:
        input.expansionOpportunities !==
        undefined
          ? this.normalizeList(
              input.expansionOpportunities,
              false,
            )
          : current.expansionOpportunities,

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

  discoverAsset(id: string) {
    return this.updateRecord(id, {
      status: 'discovered',
    });
  }

  startEvaluation(id: string) {
    return this.updateRecord(id, {
      status: 'evaluating',
    });
  }

  markProtected(id: string) {
    return this.updateRecord(id, {
      status: 'protected',
    });
  }

  startDevelopment(id: string) {
    return this.updateRecord(id, {
      status: 'developing',
    });
  }

  startLicensing(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before licensing',
      );
    }

    return this.updateRecord(id, {
      status: 'licensing',
    });
  }

  startExpansion(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before franchise expansion',
      );
    }

    return this.updateRecord(id, {
      status: 'expanding',
    });
  }

  submitForHumanReview(id: string) {
    return this.updateRecord(id, {
      status: 'human-review',
    });
  }

  approveByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'approved',
      humanApproved: true,
    });
  }

  rejectByHuman(id: string) {
    return this.updateRecord(id, {
      status: 'rejected',
      humanApproved: false,
    });
  }

  activateAsset(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before activation',
      );
    }

    return this.updateRecord(id, {
      status: 'active',
    });
  }

  retireAsset(id: string) {
    return this.updateRecord(id, {
      status: 'retired',
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addFamilyNode(
    id: string,
    input: Partial<IpFamilyNode>,
  ) {
    const record = this.getRecord(id);
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'IP family node name is required',
      );
    }

    const node = this.normalizeFamilyNode({
      id: input.id ?? randomUUID(),
      parentId:
        input.parentId?.trim() ?? record.id,
      name,
      type: input.type ?? 'other',
      relationship:
        input.relationship ?? 'other',
      status: input.status ?? 'planned',
      createdAt:
        input.createdAt?.trim() ??
        new Date().toISOString(),
    });

    return this.updateRecord(id, {
      familyTree: [...record.familyTree, node],
    });
  }

  updateFamilyNode(
    id: string,
    nodeId: string,
    input: Partial<IpFamilyNode>,
  ) {
    const record = this.getRecord(id);

    const exists = record.familyTree.some(
      (node) => node.id === nodeId,
    );

    if (!exists) {
      throw new NotFoundException(
        `IP family node '${nodeId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      familyTree: record.familyTree.map(
        (node) =>
          node.id === nodeId
            ? this.normalizeFamilyNode({
                ...node,
                ...input,
                id: node.id,
              })
            : node,
      ),
    });
  }

  removeFamilyNode(
    id: string,
    nodeId: string,
  ) {
    const record = this.getRecord(id);

    const exists = record.familyTree.some(
      (node) => node.id === nodeId,
    );

    if (!exists) {
      throw new NotFoundException(
        `IP family node '${nodeId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      familyTree: record.familyTree.filter(
        (node) => node.id !== nodeId,
      ),
    });
  }

  addRight(
    id: string,
    input: Partial<MediaIpRight>,
  ) {
    const record = this.getRecord(id);

    const right = this.normalizeRight({
      id: input.id ?? randomUUID(),
      rightType:
        input.rightType ?? 'other',
      territory:
        input.territory
          ?.trim()
          .toLowerCase() ?? 'global',
      language:
        input.language
          ?.trim()
          .toLowerCase() ?? 'all',
      owner:
        input.owner?.trim() ??
        record.owner,
      licensee:
        input.licensee?.trim() ?? '',
      exclusive:
        input.exclusive ?? false,
      startAt:
        input.startAt?.trim() ?? '',
      endAt:
        input.endAt?.trim() ?? '',
      status:
        input.status ?? 'draft',
    });

    return this.updateRecord(id, {
      rights: [...record.rights, right],
    });
  }

  updateRight(
    id: string,
    rightId: string,
    input: Partial<MediaIpRight>,
  ) {
    const record = this.getRecord(id);

    const exists = record.rights.some(
      (right) => right.id === rightId,
    );

    if (!exists) {
      throw new NotFoundException(
        `IP right '${rightId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      rights: record.rights.map((right) =>
        right.id === rightId
          ? this.normalizeRight({
              ...right,
              ...input,
              id: right.id,
            })
          : right,
      ),
    });
  }

  removeRight(id: string, rightId: string) {
    const record = this.getRecord(id);

    const exists = record.rights.some(
      (right) => right.id === rightId,
    );

    if (!exists) {
      throw new NotFoundException(
        `IP right '${rightId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      rights: record.rights.filter(
        (right) => right.id !== rightId,
      ),
    });
  }

  generateDigitalDnaProfile(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      digitalDna: record.digitalDna,
      identity: {
        title: record.title,
        originalTitle:
          record.originalTitle,
        universeName:
          record.universeName,
        franchiseName:
          record.franchiseName,
      },
      narrativeDna: {
        themes: record.themes,
        storyRules: record.storyRules,
        characters: record.characters,
        locations: record.locations,
      },
      sensoryDna: {
        visualRules: record.visualRules,
        audioRules: record.audioRules,
        brandRules: record.brandRules,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  generateProtectionPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      ownershipClarityScore:
        record.ownershipClarityScore,
      protectionScore:
        record.protectionScore,
      existingRights: record.rights,
      evidenceFiles:
        record.evidenceFiles,
      protectionStages: [
        'ownership-verification',
        'source-evidence-preservation',
        'copyright-registration',
        'trademark-evaluation',
        'format-right-documentation',
        'contract-review',
        'territory-mapping',
        'ongoing-infringement-monitoring',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateFranchisePlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      franchiseName:
        record.franchiseName,
      universeName:
        record.universeName,
      franchisePotentialScore:
        record.franchisePotentialScore,
      familyTree: record.familyTree,
      expansionModels: [
        'sequel',
        'prequel',
        'spin-off',
        'regional-adaptation',
        'multilingual-version',
        'character-series',
        'book-or-comic',
        'game-or-interactive-experience',
        'merchandise',
        'licensed-format',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateLicensingPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      licensingPotentialScore:
        record.licensingPotentialScore,
      rights: record.rights,
      targetMarkets:
        record.targetMarkets,
      licensingModels: [
        'content-syndication',
        'format-license',
        'regional-license',
        'translation-license',
        'adaptation-license',
        'character-license',
        'merchandising-license',
        'platform-exclusive-license',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateExpansionPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      globalExpansionScore:
        record.globalExpansionScore,
      targetMarkets:
        record.targetMarkets,
      platforms: record.platforms,
      audiences: record.audiences,
      opportunities:
        record.expansionOpportunities,
      expansionStages: [
        'market-prioritization',
        'cultural-validation',
        'localization',
        'partner-selection',
        'rights-clearance',
        'pilot-release',
        'performance-validation',
        'global-scale-up',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  calculateIpFinancialPerformance(id: string) {
    const record = this.getRecord(id);

    const revenue =
      record.licensingRevenue +
      record.royaltyRevenue +
      record.merchandiseRevenue +
      record.adaptationRevenue;

    const cost =
      record.protectionCost +
      record.developmentCost;

    const profit = revenue - cost;

    const returnOnInvestment =
      cost > 0
        ? (profit / cost) * 100
        : revenue > 0
          ? 100
          : 0;

    return {
      id: record.id,
      estimatedValue:
        record.estimatedValue,
      licensingRevenue:
        record.licensingRevenue,
      royaltyRevenue:
        record.royaltyRevenue,
      merchandiseRevenue:
        record.merchandiseRevenue,
      adaptationRevenue:
        record.adaptationRevenue,
      totalRevenue: Number(
        revenue.toFixed(2),
      ),
      totalCost: Number(cost.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      returnOnInvestment: Number(
        returnOnInvestment.toFixed(2),
      ),
      calculatedAt: new Date().toISOString(),
    };
  }

  runIpAssessment(id: string) {
    const record = this.getRecord(id);

    const score =
      record.originalityScore * 0.15 +
      record.ownershipClarityScore * 0.14 +
      record.protectionScore * 0.13 +
      record.licensingPotentialScore * 0.14 +
      record.franchisePotentialScore * 0.15 +
      record.globalExpansionScore * 0.1 +
      record.commercialValueScore * 0.1 +
      record.strategicValueScore * 0.09;

    const recommendation =
      score >= 90
        ? 'strategic-ip-ready-for-human-approval'
        : score >= 75
          ? 'minor-ip-development-required'
          : score >= 60
            ? 'major-ip-development-required'
            : 'not-ready-for-ip-expansion';

    return {
      id: record.id,
      score: Number(score.toFixed(2)),
      recommendation,
      humanApprovalRequired:
        record.humanApprovalRequired,
      assessedAt: new Date().toISOString(),
    };
  }

  getTopRecords(limit = 10) {
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

  private generateDigitalDna(name: string) {
    return [
      'AVOS-IP',
      name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      randomUUID().slice(0, 8).toUpperCase(),
    ].join('-');
  }

  private normalizeFamilyNode(
    node: IpFamilyNode,
  ): IpFamilyNode {
    return {
      id: node.id?.trim() || randomUUID(),
      parentId:
        node.parentId?.trim() ?? '',
      name:
        node.name?.trim() || 'Unnamed IP Node',
      type: node.type ?? 'other',
      relationship:
        node.relationship ?? 'other',
      status: node.status ?? 'planned',
      createdAt:
        node.createdAt?.trim() ??
        new Date().toISOString(),
    };
  }

  private normalizeRight(
    right: MediaIpRight,
  ): MediaIpRight {
    return {
      id: right.id?.trim() || randomUUID(),
      rightType:
        right.rightType ?? 'other',
      territory:
        right.territory
          ?.trim()
          .toLowerCase() ?? 'global',
      language:
        right.language
          ?.trim()
          .toLowerCase() ?? 'all',
      owner:
        right.owner?.trim() ?? '',
      licensee:
        right.licensee?.trim() ?? '',
      exclusive:
        right.exclusive ?? false,
      startAt:
        right.startAt?.trim() ?? '',
      endAt:
        right.endAt?.trim() ?? '',
      status: right.status ?? 'draft',
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

  private nonNegativeNumber(
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

    return Number(value.toFixed(2));
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
