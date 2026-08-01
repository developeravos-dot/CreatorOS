import { AiAgentTeamOrchestratorService } from './ai-agent-team-orchestrator.service';
import { CompetitiveIntelligenceEngineService } from './competitive-intelligence-engine.service';
import { DecisionEngineeringService } from './decision-engineering.service';
import { EnterpriseMemoryEngineService } from './enterprise-memory-engine.service';
import { FutureSimulationEngineService } from './future-simulation-engine.service';
import { IntelligenceObservabilityEngineService } from './intelligence-observability-engine.service';
import { MediaIntelligenceCloudService } from './media-intelligence-cloud.service';
import { PortfolioOptimizationEngineService } from './portfolio-optimization-engine.service';
import { PredictiveIntelligenceEngineService } from './predictive-intelligence-engine.service';
import { SignalRadarEngineService } from './signal-radar-engine.service';

function createCloud() {
  return new MediaIntelligenceCloudService(
    new SignalRadarEngineService(),
    new PredictiveIntelligenceEngineService(),
    new CompetitiveIntelligenceEngineService(),
    new DecisionEngineeringService(),
    new PortfolioOptimizationEngineService(),
    new FutureSimulationEngineService(),
    new EnterpriseMemoryEngineService(),
    new AiAgentTeamOrchestratorService(),
    new IntelligenceObservabilityEngineService(),
  );
}

describe('MediaIntelligenceCloudService', () => {
  it('creates a complete high-priority intelligence case', () => {
    const cloud = createCloud();

    const intelligenceCase = cloud.create({
      title: 'AI Historical Reconstruction Trend',
      summary: 'Rapid audience growth around AI historical reconstruction',
      source: 'Global Signal Radar',
      domain: 'trend',
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      platforms: ['YouTube', 'TikTok'],
      competitors: ['Competitor A', 'Competitor B'],
      confidence: 0.95,
      urgency: 0.9,
      impact: 0.92,
      novelty: 0.88,
      strategicFit: 0.95,
      executionReadiness: 0.85,
      risk: 0.18,
    });

    expect(intelligenceCase.radar.priority).toBe('critical');
    expect(intelligenceCase.forecast.probability).toBeGreaterThan(0.8);
    expect(intelligenceCase.futureSimulation.scenarios).toHaveLength(3);
    expect(intelligenceCase.agents.team).toContain('Strategy Agent');
  });

  it('requires human approval before execution', () => {
    const cloud = createCloud();

    const intelligenceCase = cloud.create({
      title: 'New Platform Opportunity',
      summary: 'Potential emerging platform opportunity',
      source: 'Platform Intelligence',
      domain: 'platform',
    });

    expect(() =>
      cloud.advance(
        intelligenceCase.id,
        'executing',
        'Execution Agent',
      ),
    ).toThrow();

    cloud.approve(intelligenceCase.id, 'Khalifa');

    expect(
      cloud.advance(
        intelligenceCase.id,
        'executing',
        'Khalifa',
      ).status,
    ).toBe('executing');
  });

  it('activates agents and records learning and alerts', () => {
    const cloud = createCloud();

    const intelligenceCase = cloud.create({
      title: 'Audience Retention Risk',
      summary: 'Retention decline detected in one format',
      source: 'Audience Intelligence',
      domain: 'audience',
      impact: 0.8,
      risk: 0.6,
    });

    cloud.activateAgents(intelligenceCase.id);
    cloud.updateMetric(
      intelligenceCase.id,
      'evidenceCoverage',
      0.2,
      'Observability Engine',
    );
    cloud.addLesson(
      intelligenceCase.id,
      'Format repetition reduces retention',
      'Learning Engine',
    );

    const dashboard = cloud.dashboard();

    expect(
      intelligenceCase.agents.assignments[0]!.status,
    ).toBe('active');
    expect(intelligenceCase.observability.alerts).toHaveLength(1);
    expect(intelligenceCase.memory.lessons[0]).toContain(
      'Format repetition',
    );
    expect(dashboard.totals.cases).toBe(1);
  });
});