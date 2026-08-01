import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BrandIdentity, BrandProjectInput } from './media-creative.types';

@Injectable()
export class BrandIntelligencePlatformService {
  private readonly brands = new Map<string, BrandIdentity>();

  capabilities() {
    return {
      name: 'AVOS Brand Intelligence & Creative Platform',
      version: 'BICP-1.0.0',
      capabilities: [
        'brand-naming',
        'brand-positioning',
        'logo-direction',
        'banner-direction',
        'profile-identity',
        'color-system',
        'typography-system',
        'icon-system',
        'thumbnail-system',
        'brand-voice',
        'brand-book',
        'asset-library',
        'campaign-variants',
        'seasonal-identity',
        'multilingual-consistency',
        'brand-evolution',
        'human-final-authority',
      ],
    };
  }

  create(input: BrandProjectInput): BrandIdentity {
    const now = new Date().toISOString();
    const recommendedName = input.name?.trim() || this.generateName(input);

    const brand: BrandIdentity = {
      id: randomUUID(),
      createdAt: now,
      status: 'awaiting-human-approval',
      input,
      naming: {
        recommendedName,
        alternatives: [
          `${recommendedName} Studio`,
          `${recommendedName} World`,
          `${recommendedName} Originals`,
        ],
        namingRules: [
          'memorable',
          'distinctive',
          'easy-to-pronounce',
          'multilingual-safe',
          'expandable',
        ],
      },
      positioning: {
        promise: `Premium ${input.contentType} built for ${input.audience}`,
        personality: this.personalityFor(input),
        values: ['originality', 'quality', 'trust', 'innovation', 'consistency'],
        differentiation: [
          'AI-native-production',
          'global-localization',
          'recognizable-design-system',
          'connected-to-AVOS-ecosystem',
        ],
      },
      visualIdentity: {
        logoDirection: `distinctive-symbol-plus-wordmark for ${recommendedName}`,
        bannerDirection: `platform-optimized cinematic banner for ${input.platform}`,
        profileDirection: 'high-recognition simplified avatar mark',
        palette: this.paletteFor(input),
        typography: ['Premium Display', 'Modern Sans', 'Arabic Compatible Sans'],
        iconStyle: 'clean-geometric-premium',
        thumbnailSystem: [
          'fixed-title-zone',
          'fixed-character-zone',
          'high-contrast-focus',
          'platform-safe-margins',
          'recognizable-series-code',
        ],
      },
      verbalIdentity: {
        tone: this.toneFor(input),
        messagePillars: [
          'original-worlds',
          'premium-quality',
          'audience-value',
          'global-reach',
        ],
        tagline: `Original ideas. Global impact.`,
      },
      brandBook: {
        sections: [
          'brand-strategy',
          'brand-story',
          'logo-system',
          'color-system',
          'typography',
          'imagery',
          'icons',
          'thumbnail-system',
          'motion-identity',
          'sound-identity',
          'voice-and-messaging',
          'platform-applications',
          'localization',
          'campaigns',
          'governance',
        ],
        consistencyRules: [
          'approved-logo-only',
          'approved-palette-only',
          'fixed-spacing-system',
          'fixed-thumbnail-grid',
          'preserve-parent-brand-link',
          'localize-without-breaking-identity',
        ],
        forbiddenUses: [
          'unapproved-colors',
          'distorted-logo',
          'inconsistent-type',
          'low-contrast-thumbnail',
          'unlicensed-assets',
        ],
      },
      assetLibrary: [
        { type: 'logo', name: 'Primary Logo', version: '1.0.0', status: 'planned' },
        { type: 'banner', name: 'Channel Banner', version: '1.0.0', status: 'planned' },
        { type: 'profile', name: 'Profile Image', version: '1.0.0', status: 'planned' },
        { type: 'template', name: 'Thumbnail Master', version: '1.0.0', status: 'planned' },
        { type: 'document', name: 'Brand Book', version: '1.0.0', status: 'planned' },
      ],
      campaigns: [
        { name: 'Launch Identity', season: 'launch', identityVariant: 'high-impact-launch' },
      ],
      localization: {
        languages: input.languages ?? ['Arabic', 'English'],
        cultures: input.cultures ?? [],
        adaptationRules: [
          'preserve-core-symbol',
          'preserve-color-logic',
          'adapt-type-and-copy',
          'validate-cultural-symbols',
          'maintain-parent-brand-relationship',
        ],
      },
      governance: {
        humanApproved: false,
        auditTrail: [`${now}:brand-created`],
      },
    };

    this.brands.set(brand.id, brand);
    return brand;
  }

  list() {
    return [...this.brands.values()];
  }

  get(id: string) {
    const brand = this.brands.get(id);
    if (!brand) throw new NotFoundException(`Brand not found: ${id}`);
    return brand;
  }

  approve(id: string, approvedBy: string) {
    const brand = this.get(id);
    brand.status = 'approved';
    brand.governance.humanApproved = true;
    brand.governance.approvedBy = approvedBy;
    brand.governance.auditTrail.push(`${new Date().toISOString()}:approved:${approvedBy}`);
    brand.assetLibrary = brand.assetLibrary.map((asset) => ({ ...asset, status: 'approved' }));
    return brand;
  }

  addCampaign(id: string, name: string, season: string, actor: string) {
    const brand = this.get(id);
    if (!brand.governance.humanApproved) {
      throw new Error('Human approval is required before campaign generation.');
    }
    brand.campaigns.push({
      name,
      season,
      identityVariant: `${season}-campaign-variant`,
    });
    brand.governance.auditTrail.push(`${new Date().toISOString()}:campaign-added:${name}:${actor}`);
    return brand;
  }

  private generateName(input: BrandProjectInput) {
    const token = input.contentType
      .replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, '')
      .split(' ')
      .filter(Boolean)[0] ?? 'Media';
    return `AVOS ${token}`;
  }

  private personalityFor(input: BrandProjectInput) {
    const value = `${input.audience} ${input.ageGroup} ${input.positioning ?? ''}`.toLowerCase();
    if (value.includes('children') || value.includes('kids')) {
      return ['playful', 'safe', 'curious', 'colorful'];
    }
    if (value.includes('luxury') || value.includes('premium')) {
      return ['premium', 'confident', 'minimal', 'authoritative'];
    }
    return ['modern', 'intelligent', 'original', 'global'];
  }

  private paletteFor(input: BrandProjectInput) {
    const value = `${input.contentType} ${input.positioning ?? ''}`.toLowerCase();
    if (value.includes('kids') || value.includes('children')) {
      return ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];
    }
    if (value.includes('luxury') || value.includes('premium')) {
      return ['#0A192F', '#D4AF37', '#F8F4E3', '#111111'];
    }
    return ['#0F172A', '#2563EB', '#06B6D4', '#F8FAFC'];
  }

  private toneFor(input: BrandProjectInput) {
    const value = `${input.audience} ${input.ageGroup}`.toLowerCase();
    if (value.includes('children') || value.includes('kids')) {
      return ['friendly', 'simple', 'energetic', 'safe'];
    }
    return ['clear', 'confident', 'intelligent', 'human'];
  }
}