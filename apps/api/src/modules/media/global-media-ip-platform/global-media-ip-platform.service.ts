import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AudienceNetworkIntelligenceService } from './audience-network-intelligence.service';
import { GlobalDistributionIntelligenceService } from './global-distribution-intelligence.service';
import { IntellectualPropertyLifecycleService } from './intellectual-property-lifecycle.service';
import { MonetizationCommerceIntelligenceService } from './monetization-commerce-intelligence.service';
import { PartnershipLicensingIntelligenceService } from './partnership-licensing-intelligence.service';
import { GlobalMediaAsset, GlobalMediaAssetInput } from './global-media-ip-platform.types';

@Injectable()
export class GlobalMediaIpPlatformService {
  private readonly assets = new Map<string, GlobalMediaAsset>();

  constructor(
    private readonly ipLifecycle: IntellectualPropertyLifecycleService,
    private readonly distributionIntelligence: GlobalDistributionIntelligenceService,
    private readonly monetizationIntelligence: MonetizationCommerceIntelligenceService,
    private readonly partnershipIntelligence: PartnershipLicensingIntelligenceService,
    private readonly audienceIntelligence: AudienceNetworkIntelligenceService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Global Media IP, Distribution and Monetization Platform',
      operational: true,
      systems: [
        'Intellectual Property Lifecycle Engine',
        'Global Distribution Intelligence',
        'Localization and Cultural Adaptation Network',
        'Monetization and Commerce Intelligence',
        'Partnership and Licensing Intelligence',
        'Audience Network Intelligence',
      ],
      humanFinalAuthority: true,
    };
  }

  dashboard() {
    const assets = this.list();
    return {
      capabilities: this.capabilities(),
      totals: {
        assets: assets.length,
        awaitingApproval: assets.filter((asset) => asset.status === 'awaiting-human-approval').length,
        approved: assets.filter((asset) => asset.status === 'approved').length,
        distributionReady: assets.filter((asset) => asset.status === 'distribution-ready').length,
        commerciallyActive: assets.filter((asset) => asset.status === 'commercially-active').length,
      },
      markets: [...new Set(assets.flatMap((asset) => asset.distribution.markets.map((market) => market.market)))],
      languages: [...new Set(assets.flatMap((asset) => asset.distribution.markets.flatMap((market) => market.languages)))],
      intellectualProperties: assets.map((asset) => ({ id: asset.intellectualProperty.ipId, title: asset.intellectualProperty.canonicalTitle })),
    };
  }

  create(input: GlobalMediaAssetInput): GlobalMediaAsset {
    const now = new Date().toISOString();
    const asset: GlobalMediaAsset = {
      id: randomUUID(),
      status: 'awaiting-human-approval',
      createdAt: now,
      updatedAt: now,
      input,
      intellectualProperty: this.ipLifecycle.build(input),
      distribution: this.distributionIntelligence.build(input),
      monetization: this.monetizationIntelligence.build(input),
      partnerships: this.partnershipIntelligence.build(input),
      audienceNetwork: this.audienceIntelligence.build(input),
      approvals: {
        strategyApproved: false,
        commercialApproved: false,
      },
      performance: {
        reach: 0,
        engagement: 0,
        retention: 0,
        revenue: 0,
        licensingInterest: 0,
      },
      learning: [],
    };
    this.assets.set(asset.id, asset);
    return asset;
  }

  list(): GlobalMediaAsset[] {
    return [...this.assets.values()];
  }

  get(id: string): GlobalMediaAsset {
    const asset = this.assets.get(id);
    if (!asset) throw new NotFoundException(`Global media asset not found: ${id}`);
    return asset;
  }

  approveStrategy(id: string, approvedBy: string): GlobalMediaAsset {
    const asset = this.get(id);
    asset.approvals.strategyApproved = true;
    asset.approvals.approvedBy = approvedBy;
    asset.approvals.approvedAt = new Date().toISOString();
    asset.status = 'approved';
    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  approveCommercial(id: string, approvedBy: string): GlobalMediaAsset {
    const asset = this.get(id);
    if (!asset.approvals.strategyApproved) {
      throw new Error('Human strategy approval is required before commercial approval.');
    }
    asset.approvals.commercialApproved = true;
    asset.approvals.approvedBy = approvedBy;
    asset.approvals.approvedAt = new Date().toISOString();
    asset.status = 'distribution-ready';
    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  activate(id: string): GlobalMediaAsset {
    const asset = this.get(id);
    if (!asset.approvals.strategyApproved || !asset.approvals.commercialApproved) {
      throw new Error('Human strategy and commercial approvals are required before activation.');
    }
    asset.status = 'commercially-active';
    asset.intellectualProperty.rightsRegistry = asset.intellectualProperty.rightsRegistry.map((right) => ({
      ...right,
      status: 'active',
    }));
    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  updatePerformance(
    id: string,
    performance: Partial<GlobalMediaAsset['performance']>,
  ): GlobalMediaAsset {
    const asset = this.get(id);
    asset.performance = { ...asset.performance, ...performance };
    asset.monetization = this.monetizationIntelligence.optimize(
      asset.monetization,
      asset.performance.revenue,
      asset.performance.retention,
    );
    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  learn(id: string, source: string, signal: string, value: number): GlobalMediaAsset {
    const asset = this.get(id);
    const normalized = Math.max(0, Math.min(1, value));
    const action = normalized >= 0.75 ? 'scale-winning-pattern' : normalized >= 0.5 ? 'continue-controlled-test' : 'redesign-and-revalidate';
    asset.learning.push({ at: new Date().toISOString(), source, signal, value: normalized, action });
    if (source.startsWith('market:')) {
      asset.distribution = this.distributionIntelligence.reprioritize(
        asset.distribution,
        source.replace('market:', ''),
        normalized,
      );
    }
    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  pause(id: string): GlobalMediaAsset {
    const asset = this.get(id);
    asset.status = 'paused';
    asset.updatedAt = new Date().toISOString();
    return asset;
  }
}