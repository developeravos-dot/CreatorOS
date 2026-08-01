import { AiAcquisitionEngineService } from './ai-acquisition-engine.service';
import { AiCouncilEngineService } from './ai-council-engine.service';
import { AiNegotiationEngineService } from './ai-negotiation-engine.service';
import { EcosystemOrchestrationEngineService } from './ecosystem-orchestration-engine.service';
import { EnterpriseDigitalTwinEngineService } from './enterprise-digital-twin-engine.service';
import { EnterpriseKnowledgeGraphEngineService } from './enterprise-knowledge-graph-engine.service';
import { ExecutionOrchestrationEngineService } from './execution-orchestration-engine.service';
import { MediaAutonomousEnterprisePlatformService } from './media-autonomous-enterprise-platform.service';
import { ObservabilityAuditEngineService } from './observability-audit-engine.service';
import { OpportunityMarketplaceEngineService } from './opportunity-marketplace-engine.service';
import { ScenarioSimulatorEngineService } from './scenario-simulator-engine.service';

function createPlatform() {
  return new MediaAutonomousEnterprisePlatformService(
    new AiCouncilEngineService(),
    new EnterpriseDigitalTwinEngineService(),
    new ScenarioSimulatorEngineService(),
    new EnterpriseKnowledgeGraphEngineService(),
    new AiAcquisitionEngineService(),
    new AiNegotiationEngineService(),
    new OpportunityMarketplaceEngineService(),
    new EcosystemOrchestrationEngineService(),
    new ExecutionOrchestrationEngineService(),
    new ObservabilityAuditEngineService(),
  );
}

describe('MediaAutonomousEnterprisePlatformService', () => {
  it('creates a fully modeled autonomous initiative', () => {
    const platform = createPlatform();

    const initiative = platform.create({
      name: 'Global Media Partner Network',
      objective: 'Build a global partner and licensing network',
      owner: 'AVOS Media',
      initiativeType: 'partnership',
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      partners: ['Creator Network', 'Distribution Partner'],
      budget: 500000,
      expectedReturn: 0.9,
      strategicFit: 0.95,
      readiness: 0.85,
      complexity: 0.35,
      risk: 0.2,
      timeHorizonMonths: 18,
    });

    expect(initiative.council.recommendation).toBe('prioritize');
    expect(initiative.scenarios).toHaveLength(3);
    expect(initiative.digitalTwin.projectedValue).toBeGreaterThan(500000);
    expect(initiative.ecosystem.partners).toContain('Creator Network');
  });

  it('blocks autonomous execution without human approval', () => {
    const platform = createPlatform();

    const initiative = platform.create({
      name: 'Media Market Entry',
      objective: 'Enter a new market',
      owner: 'AVOS Media',
      initiativeType: 'market-entry',
    });

    expect(() =>
      platform.advance(initiative.id, 'executing', 'AI Council'),
    ).toThrow();

    platform.approve(initiative.id, 'Khalifa');

    expect(
      platform.advance(initiative.id, 'executing', 'Khalifa').status,
    ).toBe('executing');
  });

  it('tracks metrics, learning, blockers and command-center state', () => {
    const platform = createPlatform();

    const initiative = platform.create({
      name: 'Media Acquisition Program',
      objective: 'Acquire strategic media IP',
      owner: 'AVOS Media',
      initiativeType: 'acquisition',
      budget: 1000000,
      expectedReturn: 0.8,
      strategicFit: 0.9,
      readiness: 0.75,
      risk: 0.25,
    });

    platform.approve(initiative.id, 'Khalifa');
    platform.recordMetric(
      initiative.id,
      'operationalHealth',
      0.9,
      'Observability Engine',
    );
    platform.addLesson(
      initiative.id,
      'Audience quality is more important than follower count',
      'Learning Engine',
    );
    platform.addBlocker(
      initiative.id,
      'rights-diligence-incomplete',
      'Risk Engine',
    );

    const dashboard = platform.dashboard();

    expect(initiative.knowledge.lessons[0]).toContain('Audience quality');
    expect(initiative.status).toBe('paused');
    expect(dashboard.totals.initiatives).toBe(1);
  });
});