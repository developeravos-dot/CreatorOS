import { Injectable } from '@nestjs/common';
import {
  DistributionBlueprint,
  DistributionMarketPlan,
  GlobalMediaAssetInput,
  MarketTier,
} from './global-media-ip-platform.types';

@Injectable()
export class GlobalDistributionIntelligenceService {
  build(input: GlobalMediaAssetInput): DistributionBlueprint {
    const markets = input.targetMarkets?.length ? input.targetMarkets : ['UAE', 'Saudi Arabia', 'United States'];
    const languages = input.targetLanguages?.length ? input.targetLanguages : [input.originLanguage];
    const platforms = input.platforms?.length ? input.platforms : ['YouTube', 'TikTok', 'Instagram'];

    return {
      globalReleaseMode: 'phased',
      markets: markets.map((market, index) => this.marketPlan(market, index, languages, platforms)),
      contentSupplyChain: [
        'master-asset',
        'rights-validation',
        'localization',
        'cultural-review',
        'platform-packaging',
        'publishing-schedule',
        'distribution',
        'measurement',
      ],
      localizationCouncil: ['Language Lead', 'Cultural Strategist', 'Regional Editor', 'Compliance Reviewer', 'Brand Guardian'],
      publishingControls: ['release-approval', 'platform-specification', 'rights-window', 'territory-policy', 'rollback-control'],
      performanceFeedbackLoop: ['market-performance', 'language-performance', 'platform-performance', 'creative-performance', 'release-window-performance'],
    };
  }

  reprioritize(plan: DistributionBlueprint, market: string, score: number): DistributionBlueprint {
    return {
      ...plan,
      markets: plan.markets.map((item) =>
        item.market === market
          ? { ...item, readinessScore: this.clamp(score), tier: this.tierForScore(score) }
          : item,
      ),
    };
  }

  private marketPlan(
    market: string,
    index: number,
    languages: string[],
    platforms: string[],
  ): DistributionMarketPlan {
    const readinessScore = Math.max(0.55, 0.9 - index * 0.08);
    return {
      market,
      tier: this.tierForScore(readinessScore),
      languages,
      platforms,
      releaseWindows: ['pilot', 'scale', 'always-on-library'],
      adaptationLevel: index === 0 ? 'localization' : 'cultural-remake',
      complianceGates: ['age-rating', 'platform-policy', 'advertising-policy', 'territory-rights', 'cultural-safety'],
      discoveryStrategy: ['search-intelligence', 'recommendation-signals', 'creator-collaboration', 'cross-channel-promotion'],
      crossChannelRoutes: ['master-channel', 'language-channel', 'short-form-network', 'community-network'],
      readinessScore,
    };
  }

  private tierForScore(score: number): MarketTier {
    if (score >= 0.8) return 'primary';
    if (score >= 0.6) return 'growth';
    return 'experimental';
  }

  private clamp(score: number): number {
    return Math.max(0, Math.min(1, score));
  }
}