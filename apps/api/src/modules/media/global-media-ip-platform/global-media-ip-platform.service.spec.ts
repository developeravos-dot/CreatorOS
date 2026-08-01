import { AudienceNetworkIntelligenceService } from './audience-network-intelligence.service';
import { GlobalDistributionIntelligenceService } from './global-distribution-intelligence.service';
import { GlobalMediaIpPlatformService } from './global-media-ip-platform.service';
import { IntellectualPropertyLifecycleService } from './intellectual-property-lifecycle.service';
import { MonetizationCommerceIntelligenceService } from './monetization-commerce-intelligence.service';
import { PartnershipLicensingIntelligenceService } from './partnership-licensing-intelligence.service';

function createService() {
  return new GlobalMediaIpPlatformService(
    new IntellectualPropertyLifecycleService(),
    new GlobalDistributionIntelligenceService(),
    new MonetizationCommerceIntelligenceService(),
    new PartnershipLicensingIntelligenceService(),
    new AudienceNetworkIntelligenceService(),
  );
}

describe('GlobalMediaIpPlatformService', () => {
  it('builds a governed global IP, distribution and monetization asset', () => {
    const service = createService();
    const asset = service.create({
      name: 'Future Worlds',
      assetType: 'media-franchise',
      description: 'A global future-technology content universe',
      originLanguage: 'Arabic',
      targetLanguages: ['Arabic', 'English'],
      targetMarkets: ['UAE', 'United States'],
      platforms: ['YouTube', 'TikTok'],
      audience: 'technology enthusiasts',
    });

    expect(asset.status).toBe('awaiting-human-approval');
    expect(asset.intellectualProperty.ownershipStatus).toBe('AVOS-owned');
    expect(asset.distribution.markets).toHaveLength(2);
    expect(asset.monetization.models.length).toBeGreaterThanOrEqual(8);
    expect(asset.approvals.strategyApproved).toBe(false);
  });

  it('blocks commercial activation until both human approvals exist', () => {
    const service = createService();
    const asset = service.create({
      name: 'Global Stories',
      assetType: 'series',
      description: 'Localized story series',
      originLanguage: 'Arabic',
      audience: 'families',
    });

    expect(() => service.activate(asset.id)).toThrow();
    service.approveStrategy(asset.id, 'Khalifa');
    expect(() => service.activate(asset.id)).toThrow();
    service.approveCommercial(asset.id, 'Khalifa');
    expect(service.activate(asset.id).status).toBe('commercially-active');
  });

  it('learns from market performance and expands monetization readiness', () => {
    const service = createService();
    const asset = service.create({
      name: 'Innovation Network',
      assetType: 'channel-network',
      description: 'Multilingual innovation media network',
      originLanguage: 'Arabic',
      targetMarkets: ['UAE'],
      audience: 'entrepreneurs',
    });

    service.approveStrategy(asset.id, 'Khalifa');
    service.approveCommercial(asset.id, 'Khalifa');
    service.activate(asset.id);
    service.updatePerformance(asset.id, { revenue: 1000, retention: 0.8 });
    const learned = service.learn(asset.id, 'market:UAE', 'market-fit', 0.92);

    expect(learned.learning[0]!.action).toBe('scale-winning-pattern');
    expect(learned.distribution.markets[0]!.tier).toBe('primary');
    expect(learned.monetization.models.some((model) => model.enabled)).toBe(true);
  });
});