import { Injectable } from '@nestjs/common';
import {
  GlobalMediaAssetInput,
  MonetizationBlueprint,
  RevenueModel,
} from './global-media-ip-platform.types';

@Injectable()
export class MonetizationCommerceIntelligenceService {
  build(input: GlobalMediaAssetInput): MonetizationBlueprint {
    const models: RevenueModel[] = [
      'advertising',
      'sponsorship',
      'affiliate',
      'subscription',
      'digital-product',
      'licensing',
      'commerce',
      'format-rights',
    ];

    return {
      models: models.map((model, index) => ({
        model,
        enabled: index < 3,
        readinessScore: Number(Math.max(0.4, 0.9 - index * 0.07).toFixed(2)),
        requirements: this.requirements(model, input),
      })),
      offerLadder: ['free-discovery', 'sponsor-supported', 'premium-access', 'digital-products', 'licensed-experiences', 'enterprise-rights'],
      pricingIntelligence: ['market-willingness', 'audience-value', 'competitor-benchmark', 'conversion-rate', 'lifetime-value', 'regional-affordability'],
      revenueAllocation: ['production', 'distribution', 'growth', 'IP-development', 'reserves', 'profit'],
      profitabilityGates: ['positive-unit-economics', 'rights-cost-control', 'platform-fee-control', 'minimum-margin', 'human-commercial-approval'],
      reinvestmentRules: ['winner-expansion', 'language-expansion', 'format-expansion', 'character-development', 'distribution-amplification'],
    };
  }

  optimize(blueprint: MonetizationBlueprint, revenue: number, retention: number): MonetizationBlueprint {
    const strongSignal = revenue > 0 && retention >= 0.65;
    return {
      ...blueprint,
      models: blueprint.models.map((item) => ({
        ...item,
        enabled: item.enabled || (strongSignal && item.readinessScore >= 0.6),
        readinessScore: Number(Math.min(1, item.readinessScore + (strongSignal ? 0.05 : 0)).toFixed(2)),
      })),
    };
  }

  private requirements(model: RevenueModel, input: GlobalMediaAssetInput): string[] {
    const shared = ['brand-safety', 'rights-clearance', 'measurement'];
    if (model === 'licensing' || model === 'format-rights') return [...shared, 'IP-package', 'territory-rights', 'deal-approval'];
    if (model === 'commerce') return [...shared, 'product-fit', 'supply-chain', 'customer-support'];
    if (model === 'subscription') return [...shared, 'recurring-value', 'retention-system', 'billing-compliance'];
    return [...shared, `${input.audience}-audience-fit`];
  }
}