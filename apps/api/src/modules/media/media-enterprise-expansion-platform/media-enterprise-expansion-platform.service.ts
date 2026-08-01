import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AiLicensingEngineService } from './ai-licensing-engine.service';
import { ContentIpBuilderService } from './content-ip-builder.service';
import { CreatorPartnershipPlatformService } from './creator-partnership-platform.service';
import { GlobalLocalizationEngineService } from './global-localization-engine.service';
import { MediaCommerceEngineService } from './media-commerce-engine.service';
import {
  AssetStage,
  MediaAsset,
  MediaAssetInput,
} from './media-enterprise-expansion.types';
import { PortfolioGovernanceEngineService } from './portfolio-governance-engine.service';
import { RevenueIntelligenceEngineService } from './revenue-intelligence-engine.service';

@Injectable()
export class MediaEnterpriseExpansionPlatformService {
  private readonly assets = new Map<string, MediaAsset>();

  constructor(
    private readonly ipBuilder: ContentIpBuilderService,
    private readonly localization: GlobalLocalizationEngineService,
    private readonly licensing: AiLicensingEngineService,
    private readonly partnerships: CreatorPartnershipPlatformService,
    private readonly commerce: MediaCommerceEngineService,
    private readonly revenue: RevenueIntelligenceEngineService,
    private readonly governance: PortfolioGovernanceEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Enterprise Expansion Platform',
      version: 'MEGA-1.0.0',
      operational: true,
      stages: [
        'Content IP Builder',
        'Global Localization Engine',
        'AI Licensing Engine',
        'Creator Partnership Platform',
        'Media Commerce Engine',
        'Revenue Intelligence Engine',
        'Portfolio Governance Engine',
        'Media Enterprise Command Center',
      ],
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    };
  }

  create(input: MediaAssetInput): MediaAsset {
    const now = new Date().toISOString();

    const asset: MediaAsset = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      stage: 'idea',
      input,
      ip: this.ipBuilder.build(input),
      localization: this.localization.build(input),
      licensing: this.licensing.build(input),
      partnerships: this.partnerships.build(input),
      commerce: this.commerce.build(input),
      revenue: this.revenue.build(input),
      governance: {
        humanApproved: false,
        risks: [
          'rights-clearance-required',
          'brand-safety-review-required',
          'commercial-validation-required',
        ],
      },
      history: [
        {
          at: now,
          action: 'asset-created',
          actor: input.owner,
        },
      ],
    };

    this.assets.set(asset.id, asset);
    return asset;
  }

  list(): MediaAsset[] {
    return [...this.assets.values()];
  }

  get(id: string): MediaAsset {
    const asset = this.assets.get(id);

    if (!asset) {
      throw new NotFoundException(`Media asset not found: ${id}`);
    }

    return asset;
  }

  approve(id: string, approvedBy: string): MediaAsset {
    const asset = this.get(id);
    const now = new Date().toISOString();

    asset.governance.humanApproved = true;
    asset.governance.approvedBy = approvedBy;
    asset.governance.approvedAt = now;
    asset.ip.rightsStatus = 'verified';
    asset.licensing.approved = true;
    asset.stage = 'validated';
    asset.updatedAt = now;
    asset.history.push({
      at: now,
      action: 'human-approved',
      actor: approvedBy,
    });

    return asset;
  }

  advance(id: string, stage: AssetStage, actor: string): MediaAsset {
    const asset = this.get(id);

    if (!asset.governance.humanApproved && stage !== 'idea') {
      throw new Error('Human approval is required before advancing the asset.');
    }

    const now = new Date().toISOString();
    asset.stage = stage;
    asset.updatedAt = now;
    asset.history.push({
      at: now,
      action: `advanced-to-${stage}`,
      actor,
    });

    return asset;
  }

  activatePartner(
    id: string,
    partner: string,
    actor: string,
  ): MediaAsset {
    const asset = this.get(id);

    if (!asset.governance.humanApproved) {
      throw new Error('Human approval is required before partnerships.');
    }

    if (!asset.partnerships.active.includes(partner)) {
      asset.partnerships.active.push(partner);
    }

    asset.history.push({
      at: new Date().toISOString(),
      action: `partner-activated:${partner}`,
      actor,
    });

    return asset;
  }

  recordRevenue(
    id: string,
    amount: number,
    actor: string,
  ): MediaAsset {
    const asset = this.get(id);

    if (amount < 0) {
      throw new Error('Revenue amount cannot be negative.');
    }

    asset.revenue.realized += amount;
    asset.updatedAt = new Date().toISOString();
    asset.history.push({
      at: asset.updatedAt,
      action: `revenue-recorded:${amount}`,
      actor,
    });

    if (
      asset.revenue.realized >= asset.revenue.forecast &&
      asset.governance.humanApproved
    ) {
      asset.stage = 'scaled';
    }

    return asset;
  }

  dashboard() {
    return {
      capabilities: this.capabilities(),
      portfolio: this.governance.dashboard(this.list()),
    };
  }
}