import { AiLicensingEngineService } from './ai-licensing-engine.service';
import { ContentIpBuilderService } from './content-ip-builder.service';
import { CreatorPartnershipPlatformService } from './creator-partnership-platform.service';
import { GlobalLocalizationEngineService } from './global-localization-engine.service';
import { MediaCommerceEngineService } from './media-commerce-engine.service';
import { MediaEnterpriseExpansionPlatformService } from './media-enterprise-expansion-platform.service';
import { PortfolioGovernanceEngineService } from './portfolio-governance-engine.service';
import { RevenueIntelligenceEngineService } from './revenue-intelligence-engine.service';

function createService() {
  return new MediaEnterpriseExpansionPlatformService(
    new ContentIpBuilderService(),
    new GlobalLocalizationEngineService(),
    new AiLicensingEngineService(),
    new CreatorPartnershipPlatformService(),
    new MediaCommerceEngineService(),
    new RevenueIntelligenceEngineService(),
    new PortfolioGovernanceEngineService(),
  );
}

describe('MediaEnterpriseExpansionPlatformService', () => {
  it('builds a complete global media IP asset', () => {
    const service = createService();

    const asset = service.create({
      title: 'Future Civilizations',
      concept: 'Cinematic AI stories about future human civilizations',
      category: 'future-technology',
      owner: 'AVOS Media',
      targetMarkets: ['UAE', 'Saudi Arabia', 'United States'],
      languages: ['Arabic', 'English'],
      strategicScore: 0.95,
      revenuePotential: 0.9,
      scalability: 0.92,
      originality: 0.9,
      risk: 0.2,
    });

    expect(asset.ip.extensions).toContain('licensed-format');
    expect(asset.localization.languages).toContain('Arabic');
    expect(asset.licensing.readiness).toBeGreaterThan(0.7);
    expect(asset.revenue.forecast).toBeGreaterThan(0);
  });

  it('enforces human approval before execution', () => {
    const service = createService();

    const asset = service.create({
      title: 'Mystery World',
      concept: 'Global mystery storytelling universe',
      category: 'mystery',
      owner: 'AVOS Media',
    });

    expect(() =>
      service.advance(asset.id, 'production', 'AI Agent'),
    ).toThrow();

    const approved = service.approve(asset.id, 'Khalifa');

    expect(approved.governance.humanApproved).toBe(true);
    expect(
      service.advance(asset.id, 'production', 'Khalifa').stage,
    ).toBe('production');
  });

  it('tracks partnerships, revenue and portfolio intelligence', () => {
    const service = createService();

    const asset = service.create({
      title: 'Invention Stories',
      concept: 'Original stories about inventions and inventors',
      category: 'education',
      owner: 'AVOS Media',
      strategicScore: 0.9,
      revenuePotential: 0.85,
      scalability: 0.85,
    });

    service.approve(asset.id, 'Khalifa');
    service.activatePartner(asset.id, 'Global Creator Network', 'Khalifa');
    service.recordRevenue(asset.id, 25000, 'Finance Engine');

    const dashboard = service.dashboard();

    expect(asset.partnerships.active[0]).toBe('Global Creator Network');
    expect(asset.revenue.realized).toBe(25000);
    expect(dashboard.portfolio.totalAssets).toBe(1);
    expect(dashboard.portfolio.humanApproved).toBe(1);
  });
});