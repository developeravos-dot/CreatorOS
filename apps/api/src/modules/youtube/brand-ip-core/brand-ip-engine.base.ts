import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type BrandIpStatus =
  | 'draft'
  | 'review'
  | 'active'
  | 'licensed'
  | 'protected'
  | 'expired'
  | 'archived'
  | 'rejected';

export type BrandIpPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type IntellectualPropertyType =
  | 'brand'
  | 'trademark'
  | 'copyright'
  | 'format'
  | 'character'
  | 'series'
  | 'script'
  | 'music'
  | 'video'
  | 'design'
  | 'partnership'
  | 'other';

export type RightsScope =
  | 'exclusive'
  | 'non-exclusive'
  | 'internal'
  | 'regional'
  | 'global'
  | 'platform-specific';

export interface BrandIpRecord {
  id: string;
  name: string;
  description?: string;
  category: string;
  ipType: IntellectualPropertyType;
  status: BrandIpStatus;
  priority: BrandIpPriority;
  rightsScope: RightsScope;
  owner: string;
  partner?: string;
  territory: string;
  licenseValue: number;
  royaltyRate: number;
  brandScore: number;
  protectionScore: number;
  commercialScore: number;
  registrationNumber?: string;
  licenseStartDate?: string;
  licenseEndDate?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandIpRecordInput {
  name: string;
  description?: string;
  category: string;
  ipType?: IntellectualPropertyType;
  status?: BrandIpStatus;
  priority?: BrandIpPriority;
  rightsScope?: RightsScope;
  owner: string;
  partner?: string;
  territory?: string;
  licenseValue?: number;
  royaltyRate?: number;
  brandScore?: number;
  protectionScore?: number;
  commercialScore?: number;
  registrationNumber?: string;
  licenseStartDate?: string;
  licenseEndDate?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateBrandIpRecordInput {
  name?: string;
  description?: string;
  category?: string;
  ipType?: IntellectualPropertyType;
  status?: BrandIpStatus;
  priority?: BrandIpPriority;
  rightsScope?: RightsScope;
  owner?: string;
  partner?: string;
  territory?: string;
  licenseValue?: number;
  royaltyRate?: number;
  brandScore?: number;
  protectionScore?: number;
  commercialScore?: number;
  registrationNumber?: string;
  licenseStartDate?: string;
  licenseEndDate?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface BrandIpDashboard {
  engine: string;
  version: string;
  status: 'operational';
  totalRecords: number;
  activeRecords: number;
  licensedRecords: number;
  protectedRecords: number;
  expiredRecords: number;
  criticalRecords: number;
  globalRecords: number;
  totalLicenseValue: number;
  averageRoyaltyRate: number;
  averageBrandScore: number;
  averageProtectionScore: number;
  averageCommercialScore: number;
  updatedAt: string;
}

export abstract class BrandIpEngineBase {
  private readonly records =
    new Map<string, BrandIpRecord>();

  protected constructor(
    private readonly engineName: string,
  ) {}

  getDashboard(): BrandIpDashboard {
    const records = [...this.records.values()];

    return {
      engine: this.engineName,
      version: '1.0.0',
      status: 'operational',
      totalRecords: records.length,
      activeRecords: records.filter(
        (record) => record.status === 'active',
      ).length,
      licensedRecords: records.filter(
        (record) => record.status === 'licensed',
      ).length,
      protectedRecords: records.filter(
        (record) => record.status === 'protected',
      ).length,
      expiredRecords: records.filter(
        (record) => record.status === 'expired',
      ).length,
      criticalRecords: records.filter(
        (record) => record.priority === 'critical',
      ).length,
      globalRecords: records.filter(
        (record) => record.territory === 'GLOBAL',
      ).length,
      totalLicenseValue: Number(
        records
          .reduce(
            (total, record) =>
              total + record.licenseValue,
            0,
          )
          .toFixed(2),
      ),
      averageRoyaltyRate: this.calculateAverage(
        records.map(
          (record) => record.royaltyRate,
        ),
      ),
      averageBrandScore: this.calculateAverage(
        records.map(
          (record) => record.brandScore,
        ),
      ),
      averageProtectionScore:
        this.calculateAverage(
          records.map(
            (record) => record.protectionScore,
          ),
        ),
      averageCommercialScore:
        this.calculateAverage(
          records.map(
            (record) => record.commercialScore,
          ),
        ),
      updatedAt: new Date().toISOString(),
    };
  }

  createRecord(
    input: CreateBrandIpRecordInput,
  ): BrandIpRecord {
    const name = input.name?.trim();
    const category = input.category?.trim();
    const owner = input.owner?.trim();

    if (!name) {
      throw new BadRequestException(
        'Brand or IP name is required',
      );
    }

    if (!category) {
      throw new BadRequestException(
        'Brand or IP category is required',
      );
    }

    if (!owner) {
      throw new BadRequestException(
        'Brand or IP owner is required',
      );
    }

    const licenseStartDate =
      this.normalizeOptionalDate(
        input.licenseStartDate,
        'licenseStartDate',
      );

    const licenseEndDate =
      this.normalizeOptionalDate(
        input.licenseEndDate,
        'licenseEndDate',
      );

    this.validateDateRange(
      licenseStartDate,
      licenseEndDate,
    );

    const now = new Date().toISOString();

    const record: BrandIpRecord = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      category,
      ipType: input.ipType ?? 'other',
      status: input.status ?? 'draft',
      priority: input.priority ?? 'medium',
      rightsScope:
        input.rightsScope ?? 'internal',
      owner,
      partner: input.partner?.trim(),
      territory:
        input.territory?.trim().toUpperCase() ??
        'GLOBAL',
      licenseValue: this.normalizeMoney(
        input.licenseValue ?? 0,
        'licenseValue',
      ),
      royaltyRate: this.normalizePercentage(
        input.royaltyRate ?? 0,
        'royaltyRate',
      ),
      brandScore: this.normalizePercentage(
        input.brandScore ?? 0,
        'brandScore',
      ),
      protectionScore:
        this.normalizePercentage(
          input.protectionScore ?? 0,
          'protectionScore',
        ),
      commercialScore:
        this.normalizePercentage(
          input.commercialScore ?? 0,
          'commercialScore',
        ),
      registrationNumber:
        input.registrationNumber?.trim(),
      licenseStartDate,
      licenseEndDate,
      tags: this.normalizeTags(input.tags),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(record.id, record);

    return record;
  }

  listRecords(filters?: {
    status?: BrandIpStatus;
    priority?: BrandIpPriority;
    ipType?: IntellectualPropertyType;
    rightsScope?: RightsScope;
    category?: string;
    owner?: string;
    territory?: string;
    search?: string;
    minimumCommercialScore?: number;
  }): BrandIpRecord[] {
    const search = filters?.search
      ?.trim()
      .toLowerCase();

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
          filters?.ipType &&
          record.ipType !== filters.ipType
        ) {
          return false;
        }

        if (
          filters?.rightsScope &&
          record.rightsScope !==
            filters.rightsScope
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
          filters?.territory &&
          record.territory !==
            filters.territory.toUpperCase()
        ) {
          return false;
        }

        if (
          filters?.minimumCommercialScore !==
            undefined &&
          record.commercialScore <
            filters.minimumCommercialScore
        ) {
          return false;
        }

        if (search) {
          const searchableText = [
            record.name,
            record.description ?? '',
            record.category,
            record.ipType,
            record.owner,
            record.partner ?? '',
            record.territory,
            record.registrationNumber ?? '',
            ...record.tags,
          ]
            .join(' ')
            .toLowerCase();

          if (!searchableText.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort((first, second) => {
        if (
          second.commercialScore !==
          first.commercialScore
        ) {
          return (
            second.commercialScore -
            first.commercialScore
          );
        }

        return (
          second.protectionScore -
          first.protectionScore
        );
      });
  }

  getRecord(id: string): BrandIpRecord {
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
    input: UpdateBrandIpRecordInput,
  ): BrandIpRecord {
    const current = this.getRecord(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Brand or IP name cannot be empty',
      );
    }

    if (
      input.category !== undefined &&
      !input.category.trim()
    ) {
      throw new BadRequestException(
        'Brand or IP category cannot be empty',
      );
    }

    if (
      input.owner !== undefined &&
      !input.owner.trim()
    ) {
      throw new BadRequestException(
        'Brand or IP owner cannot be empty',
      );
    }

    const licenseStartDate =
      input.licenseStartDate !== undefined
        ? this.normalizeOptionalDate(
            input.licenseStartDate,
            'licenseStartDate',
          )
        : current.licenseStartDate;

    const licenseEndDate =
      input.licenseEndDate !== undefined
        ? this.normalizeOptionalDate(
            input.licenseEndDate,
            'licenseEndDate',
          )
        : current.licenseEndDate;

    this.validateDateRange(
      licenseStartDate,
      licenseEndDate,
    );

    const updated: BrandIpRecord = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ??
        current.description,
      category:
        input.category?.trim() ?? current.category,
      owner:
        input.owner?.trim() ?? current.owner,
      partner:
        input.partner?.trim() ?? current.partner,
      territory:
        input.territory?.trim().toUpperCase() ??
        current.territory,
      licenseValue:
        input.licenseValue !== undefined
          ? this.normalizeMoney(
              input.licenseValue,
              'licenseValue',
            )
          : current.licenseValue,
      royaltyRate:
        input.royaltyRate !== undefined
          ? this.normalizePercentage(
              input.royaltyRate,
              'royaltyRate',
            )
          : current.royaltyRate,
      brandScore:
        input.brandScore !== undefined
          ? this.normalizePercentage(
              input.brandScore,
              'brandScore',
            )
          : current.brandScore,
      protectionScore:
        input.protectionScore !== undefined
          ? this.normalizePercentage(
              input.protectionScore,
              'protectionScore',
            )
          : current.protectionScore,
      commercialScore:
        input.commercialScore !== undefined
          ? this.normalizePercentage(
              input.commercialScore,
              'commercialScore',
            )
          : current.commercialScore,
      registrationNumber:
        input.registrationNumber?.trim() ??
        current.registrationNumber,
      licenseStartDate,
      licenseEndDate,
      tags:
        input.tags !== undefined
          ? this.normalizeTags(input.tags)
          : current.tags,
      metadata:
        input.metadata ?? current.metadata,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, updated);

    return updated;
  }

  submitForReview(id: string): BrandIpRecord {
    return this.updateRecord(id, {
      status: 'review',
    });
  }

  activateRecord(id: string): BrandIpRecord {
    return this.updateRecord(id, {
      status: 'active',
    });
  }

  protectRecord(
    id: string,
    registrationNumber?: string,
  ): BrandIpRecord {
    const record = this.getRecord(id);

    return this.updateRecord(id, {
      status: 'protected',
      protectionScore: Math.max(
        75,
        record.protectionScore,
      ),
      registrationNumber:
        registrationNumber?.trim() ||
        record.registrationNumber,
    });
  }

  licenseRecord(
    id: string,
    input: {
      partner: string;
      rightsScope: RightsScope;
      territory: string;
      licenseValue: number;
      royaltyRate: number;
      licenseStartDate: string;
      licenseEndDate: string;
    },
  ): BrandIpRecord {
    const partner = input.partner?.trim();

    if (!partner) {
      throw new BadRequestException(
        'Licensing partner is required',
      );
    }

    return this.updateRecord(id, {
      partner,
      status: 'licensed',
      rightsScope: input.rightsScope,
      territory: input.territory,
      licenseValue: input.licenseValue,
      royaltyRate: input.royaltyRate,
      licenseStartDate: input.licenseStartDate,
      licenseEndDate: input.licenseEndDate,
    });
  }

  expireRecord(id: string): BrandIpRecord {
    return this.updateRecord(id, {
      status: 'expired',
    });
  }

  archiveRecord(id: string): BrandIpRecord {
    return this.updateRecord(id, {
      status: 'archived',
    });
  }

  rejectRecord(id: string): BrandIpRecord {
    return this.updateRecord(id, {
      status: 'rejected',
    });
  }

  calculateLicenseRevenue(
    id: string,
    grossRevenue: number,
  ) {
    const record = this.getRecord(id);
    const normalizedGrossRevenue =
      this.normalizeMoney(
        grossRevenue,
        'grossRevenue',
      );

    const royaltyRevenue =
      normalizedGrossRevenue *
      (record.royaltyRate / 100);

    return {
      id: record.id,
      name: record.name,
      grossRevenue: normalizedGrossRevenue,
      royaltyRate: record.royaltyRate,
      royaltyRevenue: Number(
        royaltyRevenue.toFixed(2),
      ),
      fixedLicenseValue: record.licenseValue,
      totalExpectedRevenue: Number(
        (
          royaltyRevenue +
          record.licenseValue
        ).toFixed(2),
      ),
      calculatedAt: new Date().toISOString(),
    };
  }

  evaluateProtection(id: string) {
    const record = this.getRecord(id);

    const risks: string[] = [];

    if (!record.registrationNumber) {
      risks.push(
        'Registration number is missing',
      );
    }

    if (
      record.rightsScope === 'global' &&
      record.protectionScore < 80
    ) {
      risks.push(
        'Global rights need stronger protection',
      );
    }

    if (
      record.status === 'licensed' &&
      !record.partner
    ) {
      risks.push(
        'Licensed record has no partner',
      );
    }

    if (
      record.licenseEndDate &&
      new Date(record.licenseEndDate).getTime() <
        Date.now()
    ) {
      risks.push('License has expired');
    }

    return {
      id: record.id,
      protectionScore:
        record.protectionScore,
      riskLevel:
        risks.length === 0
          ? 'low'
          : risks.length <= 2
            ? 'medium'
            : 'high',
      risks,
      evaluatedAt: new Date().toISOString(),
    };
  }

  generateRecommendations(
    id: string,
  ): string[] {
    const record = this.getRecord(id);
    const recommendations: string[] = [];

    if (record.brandScore < 50) {
      recommendations.push(
        'Strengthen the brand identity and recognition system',
      );
    }

    if (record.protectionScore < 60) {
      recommendations.push(
        'Increase legal and operational IP protection',
      );
    }

    if (record.commercialScore < 50) {
      recommendations.push(
        'Develop additional licensing and commercialization models',
      );
    }

    if (!record.registrationNumber) {
      recommendations.push(
        'Add formal registration information',
      );
    }

    if (
      record.status === 'active' &&
      record.licenseValue === 0
    ) {
      recommendations.push(
        'Evaluate the asset for licensing opportunities',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Brand and intellectual property performance is healthy',
      );
    }

    return recommendations;
  }

  getTopRecords(limit = 10): BrandIpRecord[] {
    const safeLimit = Math.max(
      1,
      Math.min(100, Number(limit) || 10),
    );

    return this.listRecords().slice(0, safeLimit);
  }

  removeRecord(id: string): {
    success: true;
    id: string;
  } {
    this.getRecord(id);
    this.records.delete(id);

    return {
      success: true,
      id,
    };
  }

  private calculateAverage(
    values: number[],
  ): number {
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

  private normalizeMoney(
    value: number,
    field: string,
  ): number {
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

  private normalizePercentage(
    value: number,
    field: string,
  ): number {
    if (!Number.isFinite(value)) {
      throw new BadRequestException(
        `${field} must be a valid number`,
      );
    }

    return Number(
      Math.max(0, Math.min(100, value)).toFixed(2),
    );
  }

  private normalizeOptionalDate(
    value: string | undefined,
    field: string,
  ): string | undefined {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        `${field} must be a valid date`,
      );
    }

    return date.toISOString();
  }

  private validateDateRange(
    startDate?: string,
    endDate?: string,
  ): void {
    if (
      startDate &&
      endDate &&
      new Date(endDate).getTime() <
        new Date(startDate).getTime()
    ) {
      throw new BadRequestException(
        'licenseEndDate must be after licenseStartDate',
      );
    }
  }

  private normalizeTags(tags?: string[]): string[] {
    if (!tags) {
      return [];
    }

    return [
      ...new Set(
        tags
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
  }
}
