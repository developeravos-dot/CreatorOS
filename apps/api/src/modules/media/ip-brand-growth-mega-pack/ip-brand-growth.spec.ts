import { BrandEvolutionIntelligenceService } from './brand/brand-evolution-intelligence.service';
import { FranchiseIntelligenceService } from './franchise/franchise-intelligence.service';
import { GrowthIntelligenceService } from './growth/growth-intelligence.service';
import { IpBrandGrowthOrchestratorService } from './ip-brand-growth-orchestrator.service';
import { IpIntelligenceService } from './ip/ip-intelligence.service';
import { LicensingIntelligenceService } from './licensing/licensing-intelligence.service';
import { MarketingIntelligenceService } from './marketing/marketing-intelligence.service';
import { MonetizationIntelligenceService } from './monetization/monetization-intelligence.service';
import { PartnershipIntelligenceService } from './partnership/partnership-intelligence.service';
import { IpBrandGrowthQualityService } from './quality/ip-brand-growth-quality.service';

describe('AVOS IP & Brand Growth Mega Pack', () => {
  function service() {
    return new IpBrandGrowthOrchestratorService(
      new IpIntelligenceService(),
      new FranchiseIntelligenceService(),
      new BrandEvolutionIntelligenceService(),
      new MarketingIntelligenceService(),
      new GrowthIntelligenceService(),
      new MonetizationIntelligenceService(),
      new PartnershipIntelligenceService(),
      new LicensingIntelligenceService(),
      new IpBrandGrowthQualityService(),
    );
  }

  it('builds all eight IP and growth systems', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Future Civilizations',
      brandName: 'Future Civilizations',
      propertyType: 'global media franchise',
      concept: 'An original universe about humanity and intelligent civilizations.',
      audience: 'global premium technology audience',
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      languages: ['Arabic', 'English'],
      platforms: ['YouTube', 'TikTok', 'Instagram'],
      revenueObjectives: ['Premium Knowledge Products'],
      timeHorizonMonths: 24,
    });

    expect(program.ipAssets.length).toBeGreaterThanOrEqual(4);
    expect(program.franchise.expansionPaths.length).toBeGreaterThanOrEqual(5);
    expect(program.brandEvolution.brandPillars.length).toBeGreaterThanOrEqual(5);
    expect(program.marketing.campaigns.length).toBeGreaterThanOrEqual(3);
    expect(program.growth.loops.length).toBeGreaterThanOrEqual(4);
    expect(program.monetization.revenueStreams.length).toBeGreaterThanOrEqual(6);
    expect(program.partnerships.targets.length).toBeGreaterThanOrEqual(4);
    expect(program.licensing.packages.length).toBeGreaterThanOrEqual(4);
  });

  it('requires human approval before activation', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Approval Test',
      brandName: 'Approval Test',
      propertyType: 'media property',
      concept: 'Test governance.',
      audience: 'global',
    });

    expect(() => orchestrator.activate(program.id, 'Growth Agent')).toThrow();

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
    expect(program.quality.approved).toBe(true);
  });

  it('completes an active growth program', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Completion Test',
      brandName: 'Completion Test',
      propertyType: 'media property',
      concept: 'Test lifecycle.',
      audience: 'global',
    });

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');
    orchestrator.complete(program.id, 'Khalifa');

    expect(program.status).toBe('completed');
  });

  it('produces dashboard totals', () => {
    const orchestrator = service();

    orchestrator.create({
      title: 'Dashboard Test',
      brandName: 'Dashboard Test',
      propertyType: 'media property',
      concept: 'Test dashboard.',
      audience: 'global',
    });

    const dashboard = orchestrator.dashboard();

    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.totals.ipAssets).toBeGreaterThanOrEqual(4);
    expect(dashboard.totals.licensingPackages).toBeGreaterThanOrEqual(4);
    expect(dashboard.capabilities.systems).toHaveLength(8);
  });
});