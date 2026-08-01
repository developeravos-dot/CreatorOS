import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MonetizationStatus =
  | 'draft'
  | 'discovery'
  | 'evaluation'
  | 'negotiation'
  | 'human-review'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected'
  | 'archived';

export type MonetizationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MonetizationType =
  | 'advertising'
  | 'sponsorship'
  | 'affiliate'
  | 'digital-product'
  | 'licensing'
  | 'subscription'
  | 'commerce'
  | 'service'
  | 'other';

export interface RevenueTransaction {
  id: string;
  source: string;
  type:
    | 'revenue'
    | 'cost'
    | 'refund'
    | 'commission'
    | 'royalty';
  amount: number;
  currency: string;
  description: string;
  occurredAt: string;
  referenceId: string;
}

export interface CommercialPartner {
  id: string;
  name: string;
  type:
    | 'advertiser'
    | 'sponsor'
    | 'affiliate-network'
    | 'licensee'
    | 'platform'
    | 'customer'
    | 'other';
  contactName: string;
  contactEmail: string;
  region: string;
  status:
    | 'prospect'
    | 'contacted'
    | 'negotiating'
    | 'active'
    | 'inactive';
  estimatedValue: number;
}

export interface MediaMonetizationRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: MonetizationType;
  status: MonetizationStatus;
  priority: MonetizationPriority;

  owner: string;
  projectId: string;
  contentId: string;
  channelId: string;
  campaignId: string;

  platform: string;
  region: string;
  language: string;
  audience: string;
  niche: string;

  offerName: string;
  offerDescription: string;
  productUrl: string;
  landingPageUrl: string;
  callToAction: string;

  currency: string;
  targetRevenue: number;
  estimatedRevenue: number;
  actualRevenue: number;
  estimatedCost: number;
  actualCost: number;
  commissionRate: number;
  royaltyRate: number;
  conversionRate: number;

  impressions: number;
  clicks: number;
  leads: number;
  sales: number;
  subscribers: number;

  transactions: RevenueTransaction[];
  partners: CommercialPartner[];

  monetizationScore: number;
  audienceValueScore: number;
  sponsorFitScore: number;
  productFitScore: number;
  licensingPotentialScore: number;
  profitabilityScore: number;
  confidenceScore: number;

  risks: string[];
  issues: string[];
  recommendations: string[];
  revenueStreams: string[];
  tags: string[];

  metadata: Record<string, unknown>;

  humanApprovalRequired: boolean;
  humanApproved: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaMonetizationInput {
  name: string;
  description?: string;
  category: string;
  type?: MonetizationType;
  status?: MonetizationStatus;
  priority?: MonetizationPriority;

  owner: string;
  projectId?: string;
  contentId?: string;
  channelId?: string;
  campaignId?: string;

  platform?: string;
  region?: string;
  language?: string;
  audience?: string;
  niche?: string;

  offerName?: string;
  offerDescription?: string;
  productUrl?: string;
  landingPageUrl?: string;
  callToAction?: string;

  currency?: string;
  targetRevenue?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
  estimatedCost?: number;
  actualCost?: number;
  commissionRate?: number;
  royaltyRate?: number;
  conversionRate?: number;

  impressions?: number;
  clicks?: number;
  leads?: number;
  sales?: number;
  subscribers?: number;

  transactions?: RevenueTransaction[];
  partners?: CommercialPartner[];

  monetizationScore?: number;
  audienceValueScore?: number;
  sponsorFitScore?: number;
  productFitScore?: number;
  licensingPotentialScore?: number;
  profitabilityScore?: number;
  confidenceScore?: number;

  risks?: string[];
  issues?: string[];
  recommendations?: string[];
  revenueStreams?: string[];
  tags?: string[];

  metadata?: Record<string, unknown>;

  humanApprovalRequired?: boolean;
  humanApproved?: boolean;
}

export interface UpdateMediaMonetizationInput
  extends Partial<CreateMediaMonetizationInput> {}

export abstract class MediaMonetizationEngineBase {
  private readonly records =
    new Map<string, MediaMonetizationRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard() {
    const records = [...this.records.values()];

    const totalRevenue = records.reduce(
      (total, record) =>
        total + record.actualRevenue,
      0,
    );

    const totalCost = records.reduce(
      (total, record) =>
        total + record.actualCost,
      0,
    );

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational' as const,
      architecture:
        'AVOS Media Monetization Commerce and Revenue',
      humanFinalAuthority: true,

      totalRecords: records.length,

      discoveryRecords: records.filter(
        (record) =>
          record.status === 'discovery',
      ).length,

      evaluationRecords: records.filter(
        (record) =>
          record.status === 'evaluation',
      ).length,

      negotiationRecords: records.filter(
        (record) =>
          record.status === 'negotiation',
      ).length,

      approvedRecords: records.filter(
        (record) =>
          record.status === 'approved',
      ).length,

      activeRecords: records.filter(
        (record) => record.status === 'active',
      ).length,

      pendingHumanApproval: records.filter(
        (record) =>
          record.humanApprovalRequired &&
          !record.humanApproved,
      ).length,

      totalTargetRevenue: Number(
        records
          .reduce(
            (total, record) =>
              total + record.targetRevenue,
            0,
          )
          .toFixed(2),
      ),

      totalEstimatedRevenue: Number(
        records
          .reduce(
            (total, record) =>
              total + record.estimatedRevenue,
            0,
          )
          .toFixed(2),
      ),

      totalActualRevenue: Number(
        totalRevenue.toFixed(2),
      ),

      totalActualCost: Number(
        totalCost.toFixed(2),
      ),

      totalProfit: Number(
        (totalRevenue - totalCost).toFixed(2),
      ),

      averageProfitabilityScore: this.average(
        records.map(
          (record) =>
            record.profitabilityScore,
        ),
      ),

      averageMonetizationScore: this.average(
        records.map(
          (record) =>
            record.monetizationScore,
        ),
      ),

      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateMediaMonetizationInput,
  ): MediaMonetizationRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Monetization record name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Monetization category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Monetization owner is required',
      );
    }

    const now = new Date().toISOString();

    const record: MediaMonetizationRecord = {
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
      channelId: input.channelId?.trim() ?? '',
      campaignId:
        input.campaignId?.trim() ?? '',

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

      niche:
        input.niche?.trim().toLowerCase() ??
        'general',

      offerName:
        input.offerName?.trim() ?? '',

      offerDescription:
        input.offerDescription?.trim() ?? '',

      productUrl:
        input.productUrl?.trim() ?? '',

      landingPageUrl:
        input.landingPageUrl?.trim() ?? '',

      callToAction:
        input.callToAction?.trim() ?? '',

      currency:
        input.currency?.trim().toUpperCase() ??
        'USD',

      targetRevenue: this.nonNegativeNumber(
        input.targetRevenue ?? 0,
        'targetRevenue',
      ),

      estimatedRevenue:
        this.nonNegativeNumber(
          input.estimatedRevenue ?? 0,
          'estimatedRevenue',
        ),

      actualRevenue: this.nonNegativeNumber(
        input.actualRevenue ?? 0,
        'actualRevenue',
      ),

      estimatedCost: this.nonNegativeNumber(
        input.estimatedCost ?? 0,
        'estimatedCost',
      ),

      actualCost: this.nonNegativeNumber(
        input.actualCost ?? 0,
        'actualCost',
      ),

      commissionRate: this.percentage(
        input.commissionRate ?? 0,
        'commissionRate',
      ),

      royaltyRate: this.percentage(
        input.royaltyRate ?? 0,
        'royaltyRate',
      ),

      conversionRate: this.percentage(
        input.conversionRate ?? 0,
        'conversionRate',
      ),

      impressions: this.nonNegativeNumber(
        input.impressions ?? 0,
        'impressions',
      ),

      clicks: this.nonNegativeNumber(
        input.clicks ?? 0,
        'clicks',
      ),

      leads: this.nonNegativeNumber(
        input.leads ?? 0,
        'leads',
      ),

      sales: this.nonNegativeNumber(
        input.sales ?? 0,
        'sales',
      ),

      subscribers: this.nonNegativeNumber(
        input.subscribers ?? 0,
        'subscribers',
      ),

      transactions:
        input.transactions?.map(
          (transaction) =>
            this.normalizeTransaction(
              transaction,
            ),
        ) ?? [],

      partners:
        input.partners?.map((partner) =>
          this.normalizePartner(partner),
        ) ?? [],

      monetizationScore: this.score(
        input.monetizationScore ?? 0,
        'monetizationScore',
      ),

      audienceValueScore: this.score(
        input.audienceValueScore ?? 0,
        'audienceValueScore',
      ),

      sponsorFitScore: this.score(
        input.sponsorFitScore ?? 0,
        'sponsorFitScore',
      ),

      productFitScore: this.score(
        input.productFitScore ?? 0,
        'productFitScore',
      ),

      licensingPotentialScore: this.score(
        input.licensingPotentialScore ?? 0,
        'licensingPotentialScore',
      ),

      profitabilityScore: this.score(
        input.profitabilityScore ?? 0,
        'profitabilityScore',
      ),

      confidenceScore: this.score(
        input.confidenceScore ?? 0,
        'confidenceScore',
      ),

      risks: this.normalizeList(
        input.risks,
        false,
      ),

      issues: this.normalizeList(
        input.issues,
        false,
      ),

      recommendations: this.normalizeList(
        input.recommendations,
        false,
      ),

      revenueStreams: this.normalizeList(
        input.revenueStreams,
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
    status?: MonetizationStatus;
    priority?: MonetizationPriority;
    type?: MonetizationType;
    category?: string;
    owner?: string;
    platform?: string;
    region?: string;
    currency?: string;
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
          filters?.currency &&
          record.currency !==
            filters.currency.toUpperCase()
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
            record.niche,
            record.offerName,
            record.offerDescription,
            record.callToAction,
            ...record.revenueStreams,
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
          second.profitabilityScore -
          first.profitabilityScore,
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
    input: UpdateMediaMonetizationInput,
  ) {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Monetization record name cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Monetization owner cannot be empty',
      );
    }

    const updated: MediaMonetizationRecord = {
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

      channelId:
        input.channelId?.trim() ??
        current.channelId,

      campaignId:
        input.campaignId?.trim() ??
        current.campaignId,

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

      niche:
        input.niche?.trim().toLowerCase() ??
        current.niche,

      offerName:
        input.offerName?.trim() ??
        current.offerName,

      offerDescription:
        input.offerDescription?.trim() ??
        current.offerDescription,

      productUrl:
        input.productUrl?.trim() ??
        current.productUrl,

      landingPageUrl:
        input.landingPageUrl?.trim() ??
        current.landingPageUrl,

      callToAction:
        input.callToAction?.trim() ??
        current.callToAction,

      currency:
        input.currency?.trim().toUpperCase() ??
        current.currency,

      targetRevenue:
        input.targetRevenue !== undefined
          ? this.nonNegativeNumber(
              input.targetRevenue,
              'targetRevenue',
            )
          : current.targetRevenue,

      estimatedRevenue:
        input.estimatedRevenue !== undefined
          ? this.nonNegativeNumber(
              input.estimatedRevenue,
              'estimatedRevenue',
            )
          : current.estimatedRevenue,

      actualRevenue:
        input.actualRevenue !== undefined
          ? this.nonNegativeNumber(
              input.actualRevenue,
              'actualRevenue',
            )
          : current.actualRevenue,

      estimatedCost:
        input.estimatedCost !== undefined
          ? this.nonNegativeNumber(
              input.estimatedCost,
              'estimatedCost',
            )
          : current.estimatedCost,

      actualCost:
        input.actualCost !== undefined
          ? this.nonNegativeNumber(
              input.actualCost,
              'actualCost',
            )
          : current.actualCost,

      commissionRate:
        input.commissionRate !== undefined
          ? this.percentage(
              input.commissionRate,
              'commissionRate',
            )
          : current.commissionRate,

      royaltyRate:
        input.royaltyRate !== undefined
          ? this.percentage(
              input.royaltyRate,
              'royaltyRate',
            )
          : current.royaltyRate,

      conversionRate:
        input.conversionRate !== undefined
          ? this.percentage(
              input.conversionRate,
              'conversionRate',
            )
          : current.conversionRate,

      impressions:
        input.impressions !== undefined
          ? this.nonNegativeNumber(
              input.impressions,
              'impressions',
            )
          : current.impressions,

      clicks:
        input.clicks !== undefined
          ? this.nonNegativeNumber(
              input.clicks,
              'clicks',
            )
          : current.clicks,

      leads:
        input.leads !== undefined
          ? this.nonNegativeNumber(
              input.leads,
              'leads',
            )
          : current.leads,

      sales:
        input.sales !== undefined
          ? this.nonNegativeNumber(
              input.sales,
              'sales',
            )
          : current.sales,

      subscribers:
        input.subscribers !== undefined
          ? this.nonNegativeNumber(
              input.subscribers,
              'subscribers',
            )
          : current.subscribers,

      transactions:
        input.transactions !== undefined
          ? input.transactions.map(
              (transaction) =>
                this.normalizeTransaction(
                  transaction,
                ),
            )
          : current.transactions,

      partners:
        input.partners !== undefined
          ? input.partners.map((partner) =>
              this.normalizePartner(partner),
            )
          : current.partners,

      monetizationScore:
        input.monetizationScore !== undefined
          ? this.score(
              input.monetizationScore,
              'monetizationScore',
            )
          : current.monetizationScore,

      audienceValueScore:
        input.audienceValueScore !== undefined
          ? this.score(
              input.audienceValueScore,
              'audienceValueScore',
            )
          : current.audienceValueScore,

      sponsorFitScore:
        input.sponsorFitScore !== undefined
          ? this.score(
              input.sponsorFitScore,
              'sponsorFitScore',
            )
          : current.sponsorFitScore,

      productFitScore:
        input.productFitScore !== undefined
          ? this.score(
              input.productFitScore,
              'productFitScore',
            )
          : current.productFitScore,

      licensingPotentialScore:
        input.licensingPotentialScore !==
        undefined
          ? this.score(
              input.licensingPotentialScore,
              'licensingPotentialScore',
            )
          : current.licensingPotentialScore,

      profitabilityScore:
        input.profitabilityScore !== undefined
          ? this.score(
              input.profitabilityScore,
              'profitabilityScore',
            )
          : current.profitabilityScore,

      confidenceScore:
        input.confidenceScore !== undefined
          ? this.score(
              input.confidenceScore,
              'confidenceScore',
            )
          : current.confidenceScore,

      risks:
        input.risks !== undefined
          ? this.normalizeList(
              input.risks,
              false,
            )
          : current.risks,

      issues:
        input.issues !== undefined
          ? this.normalizeList(
              input.issues,
              false,
            )
          : current.issues,

      recommendations:
        input.recommendations !== undefined
          ? this.normalizeList(
              input.recommendations,
              false,
            )
          : current.recommendations,

      revenueStreams:
        input.revenueStreams !== undefined
          ? this.normalizeList(
              input.revenueStreams,
            )
          : current.revenueStreams,

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

  startDiscovery(id: string) {
    return this.updateRecord(id, {
      status: 'discovery',
    });
  }

  startEvaluation(id: string) {
    return this.updateRecord(id, {
      status: 'evaluation',
    });
  }

  startNegotiation(id: string) {
    return this.updateRecord(id, {
      status: 'negotiation',
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

  activateMonetization(id: string) {
    const record = this.getRecord(id);

    if (
      record.humanApprovalRequired &&
      !record.humanApproved
    ) {
      throw new BadRequestException(
        'Human approval is required before monetization activation',
      );
    }

    return this.updateRecord(id, {
      status: 'active',
    });
  }

  pauseMonetization(id: string) {
    return this.updateRecord(id, {
      status: 'paused',
    });
  }

  completeMonetization(id: string) {
    return this.updateRecord(id, {
      status: 'completed',
    });
  }

  archiveRecord(id: string) {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  addTransaction(
    id: string,
    input: Partial<RevenueTransaction>,
  ) {
    const record = this.getRecord(id);

    const amount = this.nonNegativeNumber(
      input.amount ?? 0,
      'transaction amount',
    );

    const transaction =
      this.normalizeTransaction({
        id: input.id ?? randomUUID(),
        source:
          input.source?.trim() ?? 'unknown',
        type: input.type ?? 'revenue',
        amount,
        currency:
          input.currency?.trim().toUpperCase() ??
          record.currency,
        description:
          input.description?.trim() ?? '',
        occurredAt:
          input.occurredAt?.trim() ??
          new Date().toISOString(),
        referenceId:
          input.referenceId?.trim() ?? '',
      });

    const transactions = [
      ...record.transactions,
      transaction,
    ];

    const actualRevenue =
      transactions
        .filter(
          (item) =>
            item.type === 'revenue' ||
            item.type === 'royalty' ||
            item.type === 'commission',
        )
        .reduce(
          (total, item) =>
            total + item.amount,
          0,
        ) -
      transactions
        .filter(
          (item) => item.type === 'refund',
        )
        .reduce(
          (total, item) =>
            total + item.amount,
          0,
        );

    const actualCost = transactions
      .filter((item) => item.type === 'cost')
      .reduce(
        (total, item) => total + item.amount,
        0,
      );

    return this.updateRecord(id, {
      transactions,
      actualRevenue: Math.max(
        0,
        actualRevenue,
      ),
      actualCost,
    });
  }

  removeTransaction(
    id: string,
    transactionId: string,
  ) {
    const record = this.getRecord(id);

    const exists = record.transactions.some(
      (transaction) =>
        transaction.id === transactionId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Transaction '${transactionId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      transactions: record.transactions.filter(
        (transaction) =>
          transaction.id !== transactionId,
      ),
    });
  }

  addPartner(
    id: string,
    input: Partial<CommercialPartner>,
  ) {
    const record = this.getRecord(id);
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Partner name is required',
      );
    }

    const partner = this.normalizePartner({
      id: input.id ?? randomUUID(),
      name,
      type: input.type ?? 'other',
      contactName:
        input.contactName?.trim() ?? '',
      contactEmail:
        input.contactEmail?.trim() ?? '',
      region:
        input.region?.trim().toLowerCase() ??
        'global',
      status: input.status ?? 'prospect',
      estimatedValue:
        input.estimatedValue ?? 0,
    });

    return this.updateRecord(id, {
      partners: [...record.partners, partner],
    });
  }

  updatePartner(
    id: string,
    partnerId: string,
    input: Partial<CommercialPartner>,
  ) {
    const record = this.getRecord(id);

    const exists = record.partners.some(
      (partner) => partner.id === partnerId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Partner '${partnerId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      partners: record.partners.map(
        (partner) =>
          partner.id === partnerId
            ? this.normalizePartner({
                ...partner,
                ...input,
                id: partner.id,
              })
            : partner,
      ),
    });
  }

  removePartner(
    id: string,
    partnerId: string,
  ) {
    const record = this.getRecord(id);

    const exists = record.partners.some(
      (partner) => partner.id === partnerId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Partner '${partnerId}' was not found`,
      );
    }

    return this.updateRecord(id, {
      partners: record.partners.filter(
        (partner) =>
          partner.id !== partnerId,
      ),
    });
  }

  updatePerformance(
    id: string,
    metrics: {
      impressions?: number;
      clicks?: number;
      leads?: number;
      sales?: number;
      subscribers?: number;
      actualRevenue?: number;
      actualCost?: number;
    },
  ) {
    return this.updateRecord(id, metrics);
  }

  generateAdvertisingPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      platform: record.platform,
      audience: record.audience,
      niche: record.niche,
      revenueStreams:
        record.revenueStreams,
      advertisingModels: [
        'platform-ad-revenue',
        'direct-ad-sales',
        'native-advertising',
        'branded-content',
        'performance-advertising',
        'programmatic-advertising',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateSponsorshipPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      sponsorFitScore:
        record.sponsorFitScore,
      audienceValueScore:
        record.audienceValueScore,
      partners: record.partners,
      sponsorshipPackages: [
        'episode-sponsor',
        'series-sponsor',
        'channel-sponsor',
        'segment-sponsor',
        'product-integration',
        'exclusive-category-sponsor',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateAffiliatePlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      offerName: record.offerName,
      productUrl: record.productUrl,
      landingPageUrl:
        record.landingPageUrl,
      commissionRate:
        record.commissionRate,
      funnelStages: [
        'content-discovery',
        'offer-integration',
        'call-to-action',
        'landing-page',
        'conversion',
        'commission-tracking',
        'optimization',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  generateDigitalProductPlan(id: string) {
    const record = this.getRecord(id);

    return {
      id: record.id,
      productFitScore:
        record.productFitScore,
      audience: record.audience,
      productModels: [
        'ebook',
        'course',
        'template',
        'membership',
        'premium-community',
        'software-tool',
        'media-asset-pack',
        'consulting-service',
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
      royaltyRate: record.royaltyRate,
      licensingModels: [
        'content-syndication',
        'format-licensing',
        'character-licensing',
        'brand-licensing',
        'translation-rights',
        'regional-distribution-rights',
        'training-data-license',
        'commercial-reuse-license',
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  calculateCommercialPerformance(id: string) {
    const record = this.getRecord(id);

    const clickThroughRate =
      record.impressions > 0
        ? (record.clicks /
            record.impressions) *
          100
        : 0;

    const leadConversionRate =
      record.clicks > 0
        ? (record.leads / record.clicks) *
          100
        : 0;

    const salesConversionRate =
      record.leads > 0
        ? (record.sales / record.leads) *
          100
        : 0;

    const revenuePerSale =
      record.sales > 0
        ? record.actualRevenue / record.sales
        : 0;

    const profit =
      record.actualRevenue -
      record.actualCost;

    const returnOnInvestment =
      record.actualCost > 0
        ? (profit / record.actualCost) * 100
        : record.actualRevenue > 0
          ? 100
          : 0;

    return {
      id: record.id,
      currency: record.currency,
      clickThroughRate: Number(
        clickThroughRate.toFixed(2),
      ),
      leadConversionRate: Number(
        leadConversionRate.toFixed(2),
      ),
      salesConversionRate: Number(
        salesConversionRate.toFixed(2),
      ),
      revenuePerSale: Number(
        revenuePerSale.toFixed(2),
      ),
      revenue: record.actualRevenue,
      cost: record.actualCost,
      profit: Number(profit.toFixed(2)),
      returnOnInvestment: Number(
        returnOnInvestment.toFixed(2),
      ),
      calculatedAt: new Date().toISOString(),
    };
  }

  runMonetizationAssessment(id: string) {
    const record = this.getRecord(id);

    const score =
      record.monetizationScore * 0.18 +
      record.audienceValueScore * 0.15 +
      record.sponsorFitScore * 0.14 +
      record.productFitScore * 0.14 +
      record.licensingPotentialScore *
        0.14 +
      record.profitabilityScore * 0.15 +
      record.confidenceScore * 0.1;

    const recommendation =
      score >= 90
        ? 'ready-for-human-approval'
        : score >= 75
          ? 'commercial-optimization-required'
          : score >= 60
            ? 'revenue-model-rework-required'
            : 'not-commercially-ready';

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

  private normalizeTransaction(
    transaction: RevenueTransaction,
  ): RevenueTransaction {
    return {
      id:
        transaction.id?.trim() ||
        randomUUID(),

      source:
        transaction.source?.trim() ??
        'unknown',

      type: transaction.type ?? 'revenue',

      amount: this.nonNegativeNumber(
        transaction.amount ?? 0,
        'transaction amount',
      ),

      currency:
        transaction.currency
          ?.trim()
          .toUpperCase() ?? 'USD',

      description:
        transaction.description?.trim() ??
        '',

      occurredAt:
        transaction.occurredAt?.trim() ??
        new Date().toISOString(),

      referenceId:
        transaction.referenceId?.trim() ??
        '',
    };
  }

  private normalizePartner(
    partner: CommercialPartner,
  ): CommercialPartner {
    return {
      id:
        partner.id?.trim() || randomUUID(),

      name:
        partner.name?.trim() || 'Unknown',

      type: partner.type ?? 'other',

      contactName:
        partner.contactName?.trim() ?? '',

      contactEmail:
        partner.contactEmail?.trim() ?? '',

      region:
        partner.region
          ?.trim()
          .toLowerCase() ?? 'global',

      status: partner.status ?? 'prospect',

      estimatedValue:
        this.nonNegativeNumber(
          partner.estimatedValue ?? 0,
          'estimatedValue',
        ),
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

  private percentage(
    value: number,
    field: string,
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new BadRequestException(
        `${field} must be between 0 and 100`,
      );
    }

    return Number(value.toFixed(2));
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
