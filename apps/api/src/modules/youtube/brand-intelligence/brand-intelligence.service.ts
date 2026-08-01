import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

export type BrandProfileStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'archived';

export type BrandTone =
  | 'professional'
  | 'bold'
  | 'friendly'
  | 'luxury'
  | 'educational'
  | 'entertaining'
  | 'inspirational';

export type BrandAssetType =
  | 'logo'
  | 'color'
  | 'font'
  | 'voice'
  | 'slogan'
  | 'guideline';

export interface BrandAsset {
  id: string;
  type: BrandAssetType;
  name: string;
  value: string;
  description?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  description?: string;
  status: BrandProfileStatus;
  tone: BrandTone;
  audience: string[];
  values: string[];
  keywords: string[];
  prohibitedTerms: string[];
  assets: BrandAsset[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandProfileInput {
  name: string;
  description?: string;
  status?: BrandProfileStatus;
  tone?: BrandTone;
  audience?: string[];
  values?: string[];
  keywords?: string[];
  prohibitedTerms?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateBrandProfileInput {
  name?: string;
  description?: string;
  status?: BrandProfileStatus;
  tone?: BrandTone;
  audience?: string[];
  values?: string[];
  keywords?: string[];
  prohibitedTerms?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateBrandAssetInput {
  type: BrandAssetType;
  name: string;
  value: string;
  description?: string;
  isPrimary?: boolean;
}

export interface BrandComplianceResult {
  brandId: string;
  score: number;
  compliant: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  prohibitedMatches: string[];
  recommendations: string[];
  analyzedAt: string;
}

export interface BrandDashboard {
  name: string;
  version: string;
  status: 'operational';
  totalBrands: number;
  activeBrands: number;
  totalAssets: number;
  totalsByTone: Record<BrandTone, number>;
  updatedAt: string;
}

@Injectable()
export class BrandIntelligenceService {
  private readonly brands = new Map<string, BrandProfile>();

  getDashboard(): BrandDashboard {
    const brands = [...this.brands.values()];

    return {
      name: 'CreatorOS Brand Intelligence Engine',
      version: '1.0.0',
      status: 'operational',
      totalBrands: brands.length,
      activeBrands: brands.filter(
        (brand) => brand.status === 'active',
      ).length,
      totalAssets: brands.reduce(
        (total, brand) => total + brand.assets.length,
        0,
      ),
      totalsByTone: {
        professional: brands.filter(
          (brand) => brand.tone === 'professional',
        ).length,
        bold: brands.filter(
          (brand) => brand.tone === 'bold',
        ).length,
        friendly: brands.filter(
          (brand) => brand.tone === 'friendly',
        ).length,
        luxury: brands.filter(
          (brand) => brand.tone === 'luxury',
        ).length,
        educational: brands.filter(
          (brand) => brand.tone === 'educational',
        ).length,
        entertaining: brands.filter(
          (brand) => brand.tone === 'entertaining',
        ).length,
        inspirational: brands.filter(
          (brand) => brand.tone === 'inspirational',
        ).length,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  createBrand(
    input: CreateBrandProfileInput,
  ): BrandProfile {
    const name = input.name?.trim();

    if (!name) {
      throw new BadRequestException(
        'Brand name is required',
      );
    }

    const now = new Date().toISOString();

    const brand: BrandProfile = {
      id: randomUUID(),
      name,
      description: input.description?.trim(),
      status: input.status ?? 'draft',
      tone: input.tone ?? 'professional',
      audience: this.normalizeList(input.audience),
      values: this.normalizeList(input.values),
      keywords: this.normalizeList(input.keywords),
      prohibitedTerms: this.normalizeList(
        input.prohibitedTerms,
      ),
      assets: [],
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.brands.set(brand.id, brand);

    return brand;
  }

  listBrands(filters?: {
    status?: BrandProfileStatus;
    tone?: BrandTone;
    search?: string;
  }): BrandProfile[] {
    const search = filters?.search?.trim().toLowerCase();

    return [...this.brands.values()]
      .filter((brand) => {
        if (
          filters?.status &&
          brand.status !== filters.status
        ) {
          return false;
        }

        if (
          filters?.tone &&
          brand.tone !== filters.tone
        ) {
          return false;
        }

        if (search) {
          const text = [
            brand.name,
            brand.description ?? '',
            ...brand.audience,
            ...brand.values,
            ...brand.keywords,
          ]
            .join(' ')
            .toLowerCase();

          if (!text.includes(search)) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      );
  }

  getBrand(id: string): BrandProfile {
    const brand = this.brands.get(id);

    if (!brand) {
      throw new NotFoundException(
        `Brand profile '${id}' was not found`,
      );
    }

    return brand;
  }

  updateBrand(
    id: string,
    input: UpdateBrandProfileInput,
  ): BrandProfile {
    const current = this.getBrand(id);

    if (
      input.name !== undefined &&
      !input.name.trim()
    ) {
      throw new BadRequestException(
        'Brand name cannot be empty',
      );
    }

    const updated: BrandProfile = {
      ...current,
      ...input,
      name: input.name?.trim() ?? current.name,
      description:
        input.description?.trim() ?? current.description,
      audience:
        input.audience !== undefined
          ? this.normalizeList(input.audience)
          : current.audience,
      values:
        input.values !== undefined
          ? this.normalizeList(input.values)
          : current.values,
      keywords:
        input.keywords !== undefined
          ? this.normalizeList(input.keywords)
          : current.keywords,
      prohibitedTerms:
        input.prohibitedTerms !== undefined
          ? this.normalizeList(input.prohibitedTerms)
          : current.prohibitedTerms,
      metadata: input.metadata ?? current.metadata,
      updatedAt: new Date().toISOString(),
    };

    this.brands.set(id, updated);

    return updated;
  }

  removeBrand(id: string): {
    success: true;
    id: string;
  } {
    this.getBrand(id);
    this.brands.delete(id);

    return {
      success: true,
      id,
    };
  }

  addAsset(
    brandId: string,
    input: CreateBrandAssetInput,
  ): BrandAsset {
    const brand = this.getBrand(brandId);

    const name = input.name?.trim();
    const value = input.value?.trim();

    if (!name || !value) {
      throw new BadRequestException(
        'Asset name and value are required',
      );
    }

    const now = new Date().toISOString();

    let assets = brand.assets;

    if (input.isPrimary) {
      assets = assets.map((asset) =>
        asset.type === input.type
          ? {
              ...asset,
              isPrimary: false,
              updatedAt: now,
            }
          : asset,
      );
    }

    const asset: BrandAsset = {
      id: randomUUID(),
      type: input.type,
      name,
      value,
      description: input.description?.trim(),
      isPrimary: input.isPrimary ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const updatedBrand: BrandProfile = {
      ...brand,
      assets: [...assets, asset],
      updatedAt: now,
    };

    this.brands.set(brandId, updatedBrand);

    return asset;
  }

  removeAsset(
    brandId: string,
    assetId: string,
  ): {
    success: true;
    brandId: string;
    assetId: string;
  } {
    const brand = this.getBrand(brandId);

    const exists = brand.assets.some(
      (asset) => asset.id === assetId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Brand asset '${assetId}' was not found`,
      );
    }

    const updatedBrand: BrandProfile = {
      ...brand,
      assets: brand.assets.filter(
        (asset) => asset.id !== assetId,
      ),
      updatedAt: new Date().toISOString(),
    };

    this.brands.set(brandId, updatedBrand);

    return {
      success: true,
      brandId,
      assetId,
    };
  }

  analyzeContent(
    brandId: string,
    content: string,
  ): BrandComplianceResult {
    const brand = this.getBrand(brandId);
    const normalizedContent = content?.trim().toLowerCase();

    if (!normalizedContent) {
      throw new BadRequestException(
        'Content is required for brand analysis',
      );
    }

    const matchedKeywords = brand.keywords.filter(
      (keyword) =>
        normalizedContent.includes(keyword.toLowerCase()),
    );

    const missingKeywords = brand.keywords.filter(
      (keyword) =>
        !normalizedContent.includes(keyword.toLowerCase()),
    );

    const prohibitedMatches =
      brand.prohibitedTerms.filter((term) =>
        normalizedContent.includes(term.toLowerCase()),
      );

    const keywordScore =
      brand.keywords.length === 0
        ? 100
        : (matchedKeywords.length /
            brand.keywords.length) *
          100;

    const penalty = prohibitedMatches.length * 25;

    const score = Math.max(
      0,
      Math.min(100, Math.round(keywordScore - penalty)),
    );

    const recommendations: string[] = [];

    if (missingKeywords.length > 0) {
      recommendations.push(
        `Consider including: ${missingKeywords.join(', ')}`,
      );
    }

    if (prohibitedMatches.length > 0) {
      recommendations.push(
        `Remove prohibited terms: ${prohibitedMatches.join(', ')}`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Content is aligned with the brand profile',
      );
    }

    return {
      brandId,
      score,
      compliant:
        prohibitedMatches.length === 0 && score >= 70,
      matchedKeywords,
      missingKeywords,
      prohibitedMatches,
      recommendations,
      analyzedAt: new Date().toISOString(),
    };
  }

  generateBrandBrief(id: string) {
    const brand = this.getBrand(id);

    return {
      brandId: brand.id,
      brandName: brand.name,
      status: brand.status,
      tone: brand.tone,
      targetAudience: brand.audience,
      coreValues: brand.values,
      requiredKeywords: brand.keywords,
      prohibitedTerms: brand.prohibitedTerms,
      primaryAssets: brand.assets.filter(
        (asset) => asset.isPrimary,
      ),
      instruction: this.buildInstruction(brand),
      generatedAt: new Date().toISOString(),
    };
  }

  private buildInstruction(
    brand: BrandProfile,
  ): string {
    const audience =
      brand.audience.length > 0
        ? brand.audience.join(', ')
        : 'general audience';

    const values =
      brand.values.length > 0
        ? brand.values.join(', ')
        : 'clarity and consistency';

    return [
      `Create content for ${brand.name}.`,
      `Use a ${brand.tone} tone.`,
      `Target audience: ${audience}.`,
      `Core values: ${values}.`,
      `Follow all registered brand assets and prohibited-term rules.`,
    ].join(' ');
  }

  private normalizeList(
    values?: string[],
  ): string[] {
    if (!values) {
      return [];
    }

    return [
      ...new Set(
        values
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
  }
}
