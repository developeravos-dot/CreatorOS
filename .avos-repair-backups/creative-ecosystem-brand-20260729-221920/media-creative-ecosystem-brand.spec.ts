import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';
import { CreativeProductionIntelligenceEngineService } from './creative-production-intelligence-engine.service';
import { MediaEcosystemService } from './media-ecosystem.service';

describe('AVOS Media Creative, Ecosystem and Brand Platform', () => {
  it('creates and approves a complete creative production plan', () => {
    const service = new CreativeProductionIntelligenceEngineService();

    const plan = service.create({
      title: 'Future Cities',
      contentType: 'cinematic documentary',
      audience: 'global technology audience',
      ageGroup: '18+',
      platform: 'YouTube',
      languages: ['Arabic', 'English'],
      durationSeconds: 600,
      objective: 'Build an original flagship documentary',
    });

    expect(plan.productionCouncil.length).toBeGreaterThanOrEqual(8);
    expect(plan.qualityGates).toContain('human-final-approval-gate');
    expect(plan.story.scenes.length).toBeGreaterThan(3);

    service.approve(plan.id, 'Khalifa');
    service.start(plan.id, 'Director Agent');

    expect(plan.status).toBe('active');
  });

  it('creates a complete global brand system', () => {
    const service = new BrandIntelligencePlatformService();

    const brand = service.create({
      name: 'Genesis One Media',
      contentType: 'future technology',
      audience: 'global premium audience',
      ageGroup: '18+',
      platform: 'YouTube',
      languages: ['Arabic', 'English'],
      positioning: 'premium global technology brand',
      parentBrand: 'AVOS',
    });

    expect(brand.brandBook.sections).toContain('logo-system');
    expect(brand.visualIdentity.thumbnailSystem.length).toBeGreaterThan(3);
    expect(brand.assetLibrary.length).toBeGreaterThanOrEqual(5);

    service.approve(brand.id, 'Khalifa');
    service.addCampaign(brand.id, 'Future Launch', 'launch', 'Brand Agent');

    expect(brand.campaigns).toHaveLength(2);
  });

  it('creates and activates the media ecosystem', () => {
    const service = new MediaEcosystemService();

    const ecosystem = service.create({
      name: 'AVOS Global Media Ecosystem',
      objective: 'Build and operate a global autonomous media empire',
      channels: ['Technology Channel', 'Stories Channel'],
      projects: ['CreatorOS', 'AVOS Media'],
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      languages: ['Arabic', 'English'],
      budget: 1000000,
      growthTarget: 0.9,
      risk: 0.2,
    });

    expect(ecosystem.organization.teams.length).toBeGreaterThanOrEqual(8);
    expect(ecosystem.lifecycle.stages).toContain('portfolio-evolution');
    expect(ecosystem.ipPortfolio).toHaveLength(1);

    expect(() => service.activate(ecosystem.id, 'AI Council')).toThrow();

    service.approve(ecosystem.id, 'Khalifa');
    service.activate(ecosystem.id, 'Khalifa');

    expect(ecosystem.status).toBe('active');
  });

  it('pauses the ecosystem when risk becomes critical', () => {
    const service = new MediaEcosystemService();

    const ecosystem = service.create({
      name: 'Risk Test',
      objective: 'Validate risk control',
    });

    service.updateMetric(ecosystem.id, 'riskExposure', 0.9, 'Risk Agent');

    expect(ecosystem.status).toBe('paused');
    expect(ecosystem.analytics.alerts).toContain('risk-exposure-critical');
  });
});