import { AdvertisementIntelligenceEngineService } from './advertisement-intelligence-engine.service';
import { AudienceGrowthEngineService } from './audience-growth-engine.service';
import { GlobalDistributionEngineService } from './global-distribution-engine.service';
import { MarketAudienceIntelligenceEngineService } from './market-audience-intelligence-engine.service';
import { MediaGlobalOperatingSystemService } from './media-global-operating-system.service';
import { MonetizationFinancialEngineService } from './monetization-financial-engine.service';
import { ProductionFactoryEngineService } from './production-factory-engine.service';
import { QualityGovernanceEngineService } from './quality-governance-engine.service';
import { RightsLicensingEngineService } from './rights-licensing-engine.service';
import { RiskComplianceEngineService } from './risk-compliance-engine.service';
import { SecurityResilienceEngineService } from './security-resilience-engine.service';
import { StrategyIntelligenceEngineService } from './strategy-intelligence-engine.service';

function createSystem() {
  return new MediaGlobalOperatingSystemService(
    new StrategyIntelligenceEngineService(),
    new MarketAudienceIntelligenceEngineService(),
    new ProductionFactoryEngineService(),
    new GlobalDistributionEngineService(),
    new AudienceGrowthEngineService(),
    new AdvertisementIntelligenceEngineService(),
    new MonetizationFinancialEngineService(),
    new RightsLicensingEngineService(),
    new SecurityResilienceEngineService(),
    new QualityGovernanceEngineService(),
    new RiskComplianceEngineService(),
  );
}

describe('MediaGlobalOperatingSystemService', () => {
  it('builds a complete governed global media program', () => {
    const system = createSystem();

    const program = system.create({
      name: 'AVOS Future Worlds',
      vision: 'Build a global cinematic future-technology media universe',
      category: 'future-technology',
      owner: 'AVOS Media',
      audience: ['families', 'young-adults', 'technology-enthusiasts'],
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      languages: ['Arabic', 'English'],
      platforms: ['YouTube', 'TikTok', 'Instagram'],
      strategicFit: 0.95,
      originality: 0.92,
      revenuePotential: 0.9,
      scalability: 0.95,
      readiness: 0.85,
      risk: 0.2,
    });

    expect(program.strategy.score).toBeGreaterThan(0.8);
    expect(program.production.pipeline).toContain('AI-visual-team');
    expect(program.distribution.localizationRoutes).toContain('Arabic');
    expect(program.monetization.forecast).toBeGreaterThan(0);
    expect(program.rights.rightsStatus).toBe('pending');
  });

  it('enforces human authority before execution', () => {
    const system = createSystem();

    const program = system.create({
      name: 'AVOS Mystery Network',
      vision: 'Build original global mystery content',
      category: 'mystery',
      owner: 'AVOS Media',
      audience: ['mystery-fans'],
      markets: ['UAE'],
      languages: ['Arabic'],
      platforms: ['YouTube'],
    });

    expect(() =>
      system.advance(program.id, 'production', 'AI Production Team'),
    ).toThrow();

    system.approve(program.id, 'Khalifa');

    expect(
      system.advance(program.id, 'production', 'Khalifa').status,
    ).toBe('production');
  });

  it('tracks learning, revenue and incidents in the command center', () => {
    const system = createSystem();

    const program = system.create({
      name: 'AVOS Invention Stories',
      vision: 'Original stories about inventions and inventors',
      category: 'education',
      owner: 'AVOS Media',
      audience: ['students', 'families'],
      markets: ['UAE', 'Global'],
      languages: ['Arabic', 'English'],
      platforms: ['YouTube', 'TikTok'],
    });

    system.approve(program.id, 'Khalifa');
    system.recordMetric(program.id, 'retention', 0.84, 'Learning Engine');
    system.recordRevenue(program.id, 50000, 'Financial Engine');
    system.reportIncident(program.id, 'rights-review-required', 'Security Engine');

    const dashboard = system.dashboard();

    expect(program.learning[0]!.decision).toBe('scale');
    expect(program.monetization.realized).toBe(50000);
    expect(program.status).toBe('paused');
    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.totals.incidents).toBe(1);
  });
});