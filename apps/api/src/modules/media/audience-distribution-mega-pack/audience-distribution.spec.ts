import { AudienceIntelligenceService } from './audience/audience-intelligence.service';
import { AudienceDistributionOrchestratorService } from './audience-distribution-orchestrator.service';
import { CulturalIntelligenceService } from './culture/cultural-intelligence.service';
import { GlobalLocalizationService } from './localization/global-localization.service';
import { PublishingIntelligenceService } from './publishing/publishing-intelligence.service';
import { ContentQualityIntelligenceService } from './quality/content-quality-intelligence.service';
import { ContentSafetyIntelligenceService } from './safety/content-safety-intelligence.service';
import { TrendIntelligenceService } from './trend/trend-intelligence.service';

describe('AVOS Audience & Distribution Mega Pack', () => {
  function service() {
    return new AudienceDistributionOrchestratorService(
      new TrendIntelligenceService(),
      new AudienceIntelligenceService(),
      new PublishingIntelligenceService(),
      new GlobalLocalizationService(),
      new CulturalIntelligenceService(),
      new ContentQualityIntelligenceService(),
      new ContentSafetyIntelligenceService(),
    );
  }

  it('builds all seven audience and distribution systems', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Future Civilizations',
      contentType: 'cinematic documentary',
      topic: 'future technology and civilizations',
      audience: 'global premium technology audience',
      ageGroup: '18+',
      sourceLanguage: 'Arabic',
      targetLanguages: ['Arabic', 'English', 'Spanish'],
      targetCultures: ['GCC', 'Global', 'Latin'],
      targetMarkets: ['UAE', 'Saudi Arabia', 'United States'],
      platforms: ['YouTube', 'TikTok', 'Instagram'],
      durationSeconds: 600,
      riskTolerance: 0.2,
    });

    expect(program.trends.length).toBeGreaterThanOrEqual(3);
    expect(program.audienceSegments.length).toBeGreaterThanOrEqual(3);
    expect(program.publishing.platforms.length).toBe(3);
    expect(program.localization.targets.length).toBe(3);
    expect(program.culturalReview.markets.length).toBe(3);
    expect(program.quality.approved).toBe(false);
    expect(program.safety.safeForDistribution).toBe(true);
  });

  it('requires approval before activation', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Approval Test',
      contentType: 'documentary',
      topic: 'technology',
      audience: 'global',
      ageGroup: '18+',
      platforms: ['YouTube'],
    });

    expect(() => orchestrator.activate(program.id, 'Distribution Agent')).toThrow();

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
    expect(program.quality.approved).toBe(true);
  });

  it('pauses on critical runtime risk', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Risk Test',
      contentType: 'documentary',
      topic: 'technology',
      audience: 'global',
      ageGroup: '18+',
    });

    orchestrator.updateMetric(
      program.id,
      'riskExposure',
      0.9,
      'Risk Agent',
    );

    expect(program.status).toBe('paused');
    expect(program.analytics.alerts).toContain(
      'critical-distribution-risk',
    );
  });

  it('retains distribution learning', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Learning Test',
      contentType: 'documentary',
      topic: 'technology',
      audience: 'global',
      ageGroup: '18+',
    });

    orchestrator.retainLearning(
      program.id,
      'Arabic localized hooks improved retention.',
      'Learning Agent',
    );

    expect(program.analytics.learnings).toHaveLength(1);
  });

  it('produces dashboard totals', () => {
    const orchestrator = service();

    orchestrator.create({
      title: 'Dashboard Test',
      contentType: 'documentary',
      topic: 'technology',
      audience: 'global',
      ageGroup: '18+',
      targetMarkets: ['UAE', 'Saudi Arabia'],
      targetLanguages: ['Arabic', 'English'],
      platforms: ['YouTube', 'TikTok'],
    });

    const dashboard = orchestrator.dashboard();

    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.totals.platforms).toBe(2);
    expect(dashboard.totals.markets).toBe(2);
    expect(dashboard.capabilities.systems).toHaveLength(7);
  });
});