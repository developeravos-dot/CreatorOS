import { BrandAssetsEngineService } from './brand/brand-assets-engine.service';
import { BrandIdentityEngineService } from './brand/brand-identity-engine.service';
import { BrandIntelligenceMegaPlatformService } from './brand/brand-intelligence-mega-platform.service';
import { BrandQualityEngineService } from './brand/brand-quality-engine.service';
import { BrandStrategyEngineService } from './brand/brand-strategy-engine.service';
import { EcosystemIntelligenceEngineService } from './ecosystem/ecosystem-intelligence-engine.service';
import { EcosystemInvestmentEngineService } from './ecosystem/ecosystem-investment-engine.service';
import { MediaEcosystemMegaOrchestratorService } from './ecosystem/media-ecosystem-mega-orchestrator.service';
import { EcosystemOrganizationEngineService } from './ecosystem/ecosystem-organization-engine.service';
import { EcosystemPortfolioEngineService } from './ecosystem/ecosystem-portfolio-engine.service';
import { CreativeProductionMegaEngineService } from './production/creative-production-mega-engine.service';
import { ProductionBlueprintEngineService } from './production/production-blueprint-engine.service';
import { ProductionCouncilService } from './production/production-council.service';
import { ProductionIntelligenceAnalyzerService } from './production/production-intelligence-analyzer.service';
import { ProductionModelRouterService } from './production/production-model-router.service';
import { ProductionQualityEngineService } from './production/production-quality-engine.service';

describe('AVOS Media Creative Ecosystem Brand Mega Pack', () => {
  function productionService() {
    return new CreativeProductionMegaEngineService(
      new ProductionIntelligenceAnalyzerService(),
      new ProductionModelRouterService(),
      new ProductionCouncilService(),
      new ProductionBlueprintEngineService(),
      new ProductionQualityEngineService(),
    );
  }

  function brandService() {
    return new BrandIntelligenceMegaPlatformService(
      new BrandStrategyEngineService(),
      new BrandIdentityEngineService(),
      new BrandAssetsEngineService(),
      new BrandQualityEngineService(),
    );
  }

  function ecosystemService() {
    return new MediaEcosystemMegaOrchestratorService(
      new EcosystemOrganizationEngineService(),
      new EcosystemIntelligenceEngineService(),
      new EcosystemPortfolioEngineService(),
      new EcosystemInvestmentEngineService(),
    );
  }

  it('builds a full creative production program', () => {
    const service = productionService();
    const program = service.create({
      title: 'Future Civilizations',
      contentType: 'cinematic documentary',
      audience: 'global technology audience',
      ageGroup: '18+',
      platform: 'YouTube',
      languages: ['Arabic', 'English'],
      cultures: ['GCC', 'Global'],
      durationSeconds: 600,
      objective: 'Create a flagship original documentary',
      budget: 50000,
    });

    expect(program.council.length).toBeGreaterThanOrEqual(12);
    expect(program.scenes.length).toBeGreaterThanOrEqual(20);
    expect(program.modelRouting.videoModels.length).toBeGreaterThanOrEqual(4);
    expect(program.characterBible.length).toBeGreaterThan(0);
    expect(program.quality.approved).toBe(false);

    expect(() => service.activate(program.id, 'Director Agent')).toThrow();

    service.approve(program.id, 'Khalifa');
    service.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
    expect(program.quality.approved).toBe(true);
  });

  it('builds a full brand intelligence program', () => {
    const service = brandService();
    const brand = service.create({
      requestedName: 'Genesis One Media',
      contentType: 'future technology',
      audience: 'global premium audience',
      ageGroup: '18+',
      platform: 'YouTube',
      languages: ['Arabic', 'English'],
      cultures: ['GCC', 'Global'],
      positioning: 'premium global technology brand',
      parentBrand: 'AVOS',
    });

    expect(brand.brandBook.chapters.length).toBeGreaterThanOrEqual(16);
    expect(brand.assets.length).toBeGreaterThanOrEqual(12);
    expect(brand.visualIdentity.logoSystem.length).toBeGreaterThanOrEqual(7);
    expect(brand.thumbnailSystem.platformVariants.length).toBeGreaterThanOrEqual(4);

    expect(() => service.addCampaign(brand.id, 'Season One', 'season-1', 'Brand Agent')).toThrow();

    service.approve(brand.id, 'Khalifa');
    service.addCampaign(brand.id, 'Season One', 'season-1', 'Khalifa');

    expect(brand.campaigns).toHaveLength(2);
  });

  it('builds a complete autonomous media ecosystem', () => {
    const service = ecosystemService();
    const ecosystem = service.create({
      name: 'AVOS Global Media Ecosystem',
      objective: 'Build and operate a global autonomous media empire',
      channels: ['Technology', 'Stories', 'Children'],
      projects: ['CreatorOS', 'AVOS Media', 'Genesis One'],
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      languages: ['Arabic', 'English', 'Spanish'],
      budget: 1000000,
      growthTarget: 0.9,
      riskTolerance: 0.2,
    });

    expect(ecosystem.organization.teams.length).toBeGreaterThanOrEqual(12);
    expect(ecosystem.lifecycle.stages.length).toBeGreaterThanOrEqual(24);
    expect(ecosystem.portfolio.length).toBe(3);
    expect(ecosystem.monetization.revenueStreams.length).toBeGreaterThanOrEqual(8);

    expect(() => service.activate(ecosystem.id, 'AI Council')).toThrow();

    service.approve(ecosystem.id, 'Khalifa');
    service.activate(ecosystem.id, 'Khalifa');

    expect(ecosystem.status).toBe('active');
    expect(ecosystem.lifecycle.currentStage).toBe('opportunity-validation');
  });

  it('protects the ecosystem when risk becomes critical', () => {
    const service = ecosystemService();
    const ecosystem = service.create({
      name: 'Risk Validation Ecosystem',
      objective: 'Validate autonomous risk protection',
    });

    service.updateMetric(ecosystem.id, 'riskExposure', 0.9, 'Risk Agent');

    expect(ecosystem.status).toBe('paused');
    expect(ecosystem.analytics.alerts).toContain('critical-risk-exposure');
  });

  it('retains learning across production and ecosystem programs', () => {
    const production = productionService();
    const productionProgram = production.create({
      title: 'Learning Test',
      contentType: 'cinematic',
      audience: 'global',
      ageGroup: '18+',
      platform: 'YouTube',
    });

    production.learn(productionProgram.id, 'Stronger opening hook improved retention.', 'Learning Agent');
    expect(productionProgram.learning.retainedLessons).toHaveLength(1);

    const ecosystem = ecosystemService();
    const ecosystemProgram = ecosystem.create({
      name: 'Learning Ecosystem',
      objective: 'Retain strategic learning',
    });

    ecosystem.retainLearning(
      ecosystemProgram.id,
      'Arabic localization outperformed literal dubbing.',
      'Learning Agent',
    );

    expect(ecosystemProgram.analytics.learnings).toHaveLength(1);
  });
});