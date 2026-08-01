import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BrandBrief, BrandProgram } from '../media-mega.types';
import { BrandAssetsEngineService } from './brand-assets-engine.service';
import { BrandIdentityEngineService } from './brand-identity-engine.service';
import { BrandQualityEngineService } from './brand-quality-engine.service';
import { BrandStrategyEngineService } from './brand-strategy-engine.service';

@Injectable()
export class BrandIntelligenceMegaPlatformService {
  private readonly brands = new Map<string, BrandProgram>();

  constructor(
    private readonly strategyEngine: BrandStrategyEngineService,
    private readonly identityEngine: BrandIdentityEngineService,
    private readonly assetsEngine: BrandAssetsEngineService,
    private readonly qualityEngine: BrandQualityEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Brand Intelligence & Creative Platform Mega',
      version: 'BICP-MEGA-2.0.0',
      phases: 36,
      capabilities: [
        'naming',
        'positioning',
        'brand-personality',
        'brand-voice',
        'logo-system',
        'banner-system',
        'profile-system',
        'color-system',
        'typography-system',
        'icon-system',
        'imagery-system',
        'thumbnail-system',
        'motion-identity',
        'sound-identity',
        'brand-book',
        'asset-library',
        'campaign-identity',
        'seasonal-identity',
        'multilingual-consistency',
        'brand-evolution',
        'brand-quality-intelligence',
        'human-final-authority',
      ],
    };
  }

  create(brief: BrandBrief) {
    const now = new Date().toISOString();
    const strategy = this.strategyEngine.build(brief);
    const visualIdentity = this.identityEngine.build(brief, strategy.recommendedName);

    const program: BrandProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      strategy,
      verbalIdentity: {
        tagline: 'Original ideas. Global impact.',
        tone: strategy.personality,
        vocabulary: ['original', 'intelligent', 'global', 'trusted', 'premium'],
        forbiddenLanguage: ['misleading-claims', 'cheap-imitation', 'inconsistent-slang'],
        messagePillars: [
          'original-worlds',
          'premium-production',
          'audience-value',
          'global-expansion',
        ],
        sampleMessages: [
          `${strategy.recommendedName} creates original experiences for a global audience.`,
          'Every story is built with intelligence, quality and consistency.',
        ],
      },
      visualIdentity,
      thumbnailSystem: {
        grid: ['fixed-title-zone', 'fixed-subject-zone', 'fixed-brand-code-zone'],
        titleRules: ['short-title', 'high-contrast', 'mobile-readable', 'language-safe'],
        faceRules: ['single-primary-emotion', 'consistent-character-identity', 'no-distortion'],
        contrastRules: ['subject-background-separation', 'one-primary-accent'],
        seriesCodes: ['series-color', 'episode-number', 'format-symbol'],
        platformVariants: ['youtube-16:9', 'shorts-9:16', 'social-1:1', 'story-9:16'],
      },
      brandBook: {
        chapters: [
          'brand-strategy',
          'brand-story',
          'brand-architecture',
          'logo-system',
          'color-system',
          'typography',
          'iconography',
          'imagery',
          'thumbnail-system',
          'motion-identity',
          'sound-identity',
          'verbal-identity',
          'platform-applications',
          'localization',
          'campaigns',
          'governance',
        ],
        approvedRules: [
          'approved-logo-only',
          'approved-palette-only',
          'approved-type-system',
          'fixed-spacing-system',
          'fixed-thumbnail-logic',
          'preserve-parent-brand-link',
          'localize-without-breaking-identity',
        ],
        forbiddenUses: [
          'distorted-logo',
          'unapproved-colors',
          'low-contrast-content',
          'inconsistent-type',
          'unlicensed-assets',
          'unauthorized-redesign',
        ],
      },
      assets: this.assetsEngine.build(brief),
      campaigns: [
        {
          id: randomUUID(),
          name: 'Launch Identity',
          season: 'launch',
          concept: 'high-impact-global-launch',
          status: 'planned',
        },
      ],
      localization: {
        languages: brief.languages ?? ['Arabic', 'English'],
        cultures: brief.cultures ?? [],
        rules: [
          'preserve-core-symbol',
          'preserve-color-logic',
          'adapt-copy-and-typography',
          'validate-cultural-symbols',
          'retain-parent-brand-relationship',
        ],
      },
      intelligence: {
        consistencyScore: 0,
        recognitionScore: 0,
        differentiationScore: 0,
        growthRecommendations: [],
      },
      governance: {
        humanApproved: false,
        auditTrail: [
          {
            at: now,
            actor: 'Brand Intelligence Platform',
            action: 'brand-program-created',
          },
        ],
      },
    };

    program.intelligence = this.qualityEngine.evaluate(program);
    this.brands.set(program.id, program);
    return program;
  }

  list() {
    return [...this.brands.values()];
  }

  get(id: string) {
    const program = this.brands.get(id);
    if (!program) throw new NotFoundException(`Brand program not found: ${id}`);
    return program;
  }

  approve(id: string, approvedBy: string) {
    const program = this.get(id);
    const now = new Date().toISOString();
    program.status = 'approved';
    program.updatedAt = now;
    program.governance.humanApproved = true;
    program.governance.approvedBy = approvedBy;
    program.governance.approvedAt = now;
    program.assets = program.assets.map((asset) => ({
      ...asset,
      status: 'approved',
    }));
    program.governance.auditTrail.push({
      at: now,
      actor: approvedBy,
      action: 'brand-human-approved',
    });
    program.intelligence = this.qualityEngine.evaluate(program);
    return program;
  }

  addCampaign(id: string, name: string, season: string, actor: string) {
    const program = this.get(id);
    if (!program.governance.humanApproved) {
      throw new Error('Human approval is required before campaign creation.');
    }

    const now = new Date().toISOString();
    program.campaigns.push({
      id: randomUUID(),
      name,
      season,
      concept: `${season}-brand-identity-variant`,
      status: 'planned',
    });
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'campaign-created',
      details: { name, season },
    });
    return program;
  }

  evolve(id: string, recommendation: string, actor: string) {
    const program = this.get(id);
    if (!program.governance.humanApproved) {
      throw new Error('Human approval is required before brand evolution.');
    }

    const now = new Date().toISOString();
    program.intelligence.growthRecommendations.push(recommendation);
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'brand-evolution-proposed',
      details: { recommendation },
    });
    return program;
  }

  dashboard() {
    const items = this.list();
    return {
      capabilities: this.capabilities(),
      totals: {
        brands: items.length,
        approved: items.filter((item) => item.governance.humanApproved).length,
        assets: items.reduce((sum, item) => sum + item.assets.length, 0),
        campaigns: items.reduce((sum, item) => sum + item.campaigns.length, 0),
        languages: new Set(items.flatMap((item) => item.localization.languages)).size,
      },
      brands: items.map((item) => ({
        id: item.id,
        name: item.strategy.recommendedName,
        status: item.status,
        assets: item.assets.length,
        campaigns: item.campaigns.length,
        intelligence: item.intelligence,
      })),
    };
  }
}