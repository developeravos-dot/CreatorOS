import { AutonomousGrowthEngineService } from './autonomous-growth-engine.service';
import { ContentInvestmentEngineService } from './content-investment-engine.service';
import { MediaGrowthOpportunityPlatformService } from './media-growth-opportunity-platform.service';
import { OpportunityRadarService } from './opportunity-radar.service';

function createService() {
  return new MediaGrowthOpportunityPlatformService(
    new OpportunityRadarService(),
    new ContentInvestmentEngineService(),
    new AutonomousGrowthEngineService(),
  );
}

describe('MediaGrowthOpportunityPlatformService', () => {
  it('detects and scores a strategic media opportunity', () => {
    const service = createService();

    const opportunity = service.create({
      title: 'AI-Recreated Historical Worlds',
      description: 'Cinematic multilingual historical reconstruction series',
      source: 'innovation-lab',
      type: 'content-format',
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      platforms: ['YouTube', 'TikTok'],
      languages: ['Arabic', 'English'],
      audience: 'families and young adults',
      urgency: 0.8,
      strategicFit: 0.95,
      commercialPotential: 0.85,
      originality: 0.9,
      executionReadiness: 0.8,
      risk: 0.25,
    });

    expect(opportunity.score.recommendation).toBe('prioritize');
    expect(opportunity.status).toBe('awaiting-human-approval');
    expect(opportunity.growthPlaybook.growthLoops).toContain('winner-to-IP');
  });

  it('blocks experiments until human approval', () => {
    const service = createService();

    const opportunity = service.create({
      title: 'Mystery Shorts Network',
      description: 'Short-form mystery content network',
      source: 'opportunity-radar',
      type: 'content-format',
      strategicFit: 0.8,
      commercialPotential: 0.8,
      originality: 0.75,
    });

    expect(() =>
      service.launchExperiment(
        opportunity.id,
        'Mystery shorts increase returning viewers',
        'returning-viewer-rate',
        0.3,
      ),
    ).toThrow();

    service.approve(opportunity.id, 'Khalifa');

    const launched = service.launchExperiment(
      opportunity.id,
      'Mystery shorts increase returning viewers',
      'returning-viewer-rate',
      0.3,
    );

    expect(launched.status).toBe('experimenting');
  });

  it('learns from results and allows scaling after success', () => {
    const service = createService();

    const opportunity = service.create({
      title: 'Future Technology Stories',
      description: 'Global future technology storytelling format',
      source: 'content-investment-engine',
      type: 'content-format',
      strategicFit: 0.9,
      commercialPotential: 0.9,
      originality: 0.85,
      executionReadiness: 0.8,
      risk: 0.2,
    });

    service.approve(opportunity.id, 'Khalifa');
    service.launchExperiment(
      opportunity.id,
      'Future stories improve audience retention',
      'retention',
      0.65,
    );

    const learned = service.recordResult(opportunity.id, 0.72);

    expect(learned.learning[0]!.decision).toBe(
      'submit-for-human-scale-approval',
    );

    expect(service.scale(opportunity.id).status).toBe('scaling');
  });
});