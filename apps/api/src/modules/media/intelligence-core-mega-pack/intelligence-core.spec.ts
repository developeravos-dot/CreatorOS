import { MediaAnalyticsIntelligenceService } from './analytics/media-analytics-intelligence.service';
import { MediaDigitalDnaService } from './digital-dna/media-digital-dna.service';
import { AutonomousImprovementIntelligenceService } from './improvement/autonomous-improvement-intelligence.service';
import { IntelligenceCoreOrchestratorService } from './intelligence-core-orchestrator.service';
import { MediaKnowledgeGraphService } from './knowledge-graph/media-knowledge-graph.service';
import { MediaLearningIntelligenceService } from './learning/media-learning-intelligence.service';
import { MediaMemoryIntelligenceService } from './memory/media-memory-intelligence.service';
import { IntelligenceCoreQualityService } from './quality/intelligence-core-quality.service';

describe('AVOS Media Intelligence Core Mega Pack', () => {
  function service() {
    return new IntelligenceCoreOrchestratorService(
      new MediaAnalyticsIntelligenceService(),
      new MediaLearningIntelligenceService(),
      new AutonomousImprovementIntelligenceService(),
      new MediaKnowledgeGraphService(),
      new MediaMemoryIntelligenceService(),
      new MediaDigitalDnaService(),
      new IntelligenceCoreQualityService(),
    );
  }

  it('builds all six intelligence core systems', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'AVOS Media Intelligence',
      projectId: 'AVOS-MEDIA',
      domain: 'media',
      objectives: [
        'produce-original-content',
        'learn-from-performance',
        'protect-human-authority',
      ],
      dataSources: [
        'creative-production',
        'audience-distribution',
        'ip-brand-growth',
      ],
      metrics: [
        'reach',
        'retention',
        'engagement',
        'quality',
        'revenue',
      ],
      protectedPrinciples: [
        'original-content-first',
      ],
    });

    expect(program.analytics).toHaveLength(1);
    expect(program.improvements.length).toBeGreaterThanOrEqual(1);
    expect(program.knowledgeGraph.nodes.length).toBeGreaterThanOrEqual(4);
    expect(program.memory).toHaveLength(0);
    expect(program.digitalDna.principles).toContain(
      'human-final-authority',
    );
    expect(program.digitalDna.forbiddenMutations.length).toBeGreaterThan(0);
  });

  it('requires human approval before activation', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Approval Test',
      projectId: 'TEST-1',
      domain: 'media',
      objectives: ['test-governance'],
    });

    expect(() =>
      orchestrator.activate(program.id, 'AI Agent'),
    ).toThrow();

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
    expect(program.quality.approved).toBe(true);
  });

  it('records analytics and generates improvements', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Analytics Test',
      projectId: 'TEST-2',
      domain: 'media',
      objectives: ['improve-performance'],
      metrics: ['retention', 'engagement'],
    });

    orchestrator.recordAnalytics(
      program.id,
      {
        retention: 45,
        engagement: 55,
      },
      'Analytics Agent',
    );

    expect(program.analytics).toHaveLength(2);
    expect(program.improvements.length).toBeGreaterThanOrEqual(1);
  });

  it('records learning and memory', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Learning Test',
      projectId: 'TEST-3',
      domain: 'media',
      objectives: ['retain-learning'],
    });

    orchestrator.learn(
      program.id,
      'YouTube analytics',
      'Arabic hooks increased retention.',
      0.9,
      'Learning Agent',
    );

    orchestrator.remember(
      program.id,
      'audience-learning',
      'Arabic hooks increased retention.',
      'validated-experiment',
      ['arabic', 'retention', 'hooks'],
      0.95,
      'Memory Agent',
    );

    const results = orchestrator.searchMemory(
      program.id,
      'retention',
    );

    expect(program.learnings).toHaveLength(1);
    expect(program.memory).toHaveLength(1);
    expect(results).toHaveLength(1);
  });

  it('requires human approval for improvement proposals', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Improvement Test',
      projectId: 'TEST-4',
      domain: 'media',
      objectives: ['safe-improvement'],
    });

    const proposal = program.improvements[0];

    if (!proposal) {
      throw new Error('Expected an improvement proposal.');
    }

    orchestrator.approveImprovement(
      program.id,
      proposal.id,
      'Khalifa',
    );

    expect(proposal.status).toBe('human-approved');
  });

  it('produces dashboard totals', () => {
    const orchestrator = service();

    orchestrator.create({
      title: 'Dashboard Test',
      projectId: 'TEST-5',
      domain: 'media',
      objectives: ['dashboard'],
    });

    const dashboard = orchestrator.dashboard();

    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.totals.analyticsSnapshots).toBe(1);
    expect(dashboard.totals.knowledgeNodes).toBeGreaterThanOrEqual(2);
    expect(dashboard.capabilities.systems).toHaveLength(6);
  });
});