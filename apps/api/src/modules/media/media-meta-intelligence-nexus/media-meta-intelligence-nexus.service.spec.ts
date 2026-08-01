import { AdaptiveWorkflowEngineService } from './adaptive-workflow-engine.service';
import { AutonomousPlanningEngineService } from './autonomous-planning-engine.service';
import { CapabilityEvolutionEngineService } from './capability-evolution-engine.service';
import { CrossDomainReasoningEngineService } from './cross-domain-reasoning-engine.service';
import { CrossProjectIntelligenceEngineService } from './cross-project-intelligence-engine.service';
import { DigitalOrganizationBrainService } from './digital-organization-brain.service';
import { EcosystemIntelligenceEngineService } from './ecosystem-intelligence-engine.service';
import { EnterpriseDnaEngineService } from './enterprise-dna-engine.service';
import { EvidenceRankingEngineService } from './evidence-ranking-engine.service';
import { ExecutiveCommandNexusEngineService } from './executive-command-nexus-engine.service';
import { GlobalEventCorrelationEngineService } from './global-event-correlation-engine.service';
import { InnovationLabEngineService } from './innovation-lab-engine.service';
import { KnowledgeFabricEngineService } from './knowledge-fabric-engine.service';
import { MediaMetaIntelligenceNexusService } from './media-meta-intelligence-nexus.service';
import { OpportunityGraphEngineService } from './opportunity-graph-engine.service';
import { PortfolioEvolutionEngineService } from './portfolio-evolution-engine.service';
import { PredictiveOpportunityRiskEngineService } from './predictive-opportunity-risk-engine.service';
import { ScenarioMatrixEngineService } from './scenario-matrix-engine.service';
import { SelfOptimizationEngineService } from './self-optimization-engine.service';
import { SemanticMemoryEngineService } from './semantic-memory-engine.service';
import { SimulationGridEngineService } from './simulation-grid-engine.service';
import { TrendIntelligenceEngineService } from './trend-intelligence-engine.service';
import { WorldModelEngineService } from './world-model-engine.service';

function createNexus() {
  return new MediaMetaIntelligenceNexusService(
    new KnowledgeFabricEngineService(),
    new WorldModelEngineService(),
    new SemanticMemoryEngineService(),
    new CrossProjectIntelligenceEngineService(),
    new OpportunityGraphEngineService(),
    new InnovationLabEngineService(),
    new EvidenceRankingEngineService(),
    new ScenarioMatrixEngineService(),
    new TrendIntelligenceEngineService(),
    new EnterpriseDnaEngineService(),
    new DigitalOrganizationBrainService(),
    new CapabilityEvolutionEngineService(),
    new SelfOptimizationEngineService(),
    new SimulationGridEngineService(),
    new GlobalEventCorrelationEngineService(),
    new PredictiveOpportunityRiskEngineService(),
    new AdaptiveWorkflowEngineService(),
    new CrossDomainReasoningEngineService(),
    new PortfolioEvolutionEngineService(),
    new EcosystemIntelligenceEngineService(),
    new AutonomousPlanningEngineService(),
    new ExecutiveCommandNexusEngineService(),
  );
}

describe('MediaMetaIntelligenceNexusService', () => {
  it('creates a complete 32-phase meta intelligence case', () => {
    const nexus = createNexus();

    const intelligenceCase = nexus.create({
      name: 'Global AI Media IP Expansion',
      objective: 'Build a global AI-native media IP portfolio',
      owner: 'AVOS Media',
      domain: 'ip',
      markets: ['UAE', 'Saudi Arabia', 'United States'],
      projects: ['CreatorOS', 'AVOS Media', 'AVOS Live'],
      capabilities: ['research', 'ai-agents', 'observability'],
      signals: [
        {
          source: 'Market Research',
          statement: 'Demand for AI-native original formats is increasing',
          confidence: 0.92,
          recency: 0.95,
          relevance: 0.98,
        },
      ],
      budget: 1000000,
      expectedReturn: 0.9,
      strategicFit: 0.96,
      urgency: 0.82,
      readiness: 0.78,
      complexity: 0.48,
      risk: 0.24,
      timeHorizonMonths: 24,
    });

    expect(intelligenceCase.knowledgeFabric.entities).toContain('CreatorOS');
    expect(intelligenceCase.scenarios).toHaveLength(4);
    expect(intelligenceCase.innovation.experiments).toHaveLength(1);
    expect(intelligenceCase.digitalOrganization.executiveCouncil).toHaveLength(4);
    expect(intelligenceCase.portfolio.priorityScore).toBeGreaterThan(0.7);
    expect(intelligenceCase.governance.finalAuthority).toBe('human');
  });

  it('enforces human approval before autonomous execution', () => {
    const nexus = createNexus();

    const intelligenceCase = nexus.create({
      name: 'New Media Platform',
      objective: 'Build a new media platform capability',
      owner: 'AVOS Media',
      domain: 'platform',
    });

    expect(() =>
      nexus.advance(intelligenceCase.id, 'executing', 'AI Executive Council'),
    ).toThrow();

    nexus.approve(intelligenceCase.id, 'Khalifa');

    expect(
      nexus.advance(intelligenceCase.id, 'executing', 'Khalifa').status,
    ).toBe('executing');
  });

  it('runs an approved experiment and stores learning', () => {
    const nexus = createNexus();

    const intelligenceCase = nexus.create({
      name: 'Content Format Experiment',
      objective: 'Validate a new original media format',
      owner: 'AVOS Media',
      domain: 'content',
      strategicFit: 0.9,
      readiness: 0.8,
      risk: 0.2,
    });

    nexus.approve(intelligenceCase.id, 'Khalifa');

    const experimentId = intelligenceCase.innovation.experiments[0]!.id;

    nexus.approveExperiment(
      intelligenceCase.id,
      experimentId,
      'Khalifa',
    );

    nexus.startExperiment(
      intelligenceCase.id,
      experimentId,
      'Experiment Agent',
    );

    nexus.completeExperiment(
      intelligenceCase.id,
      experimentId,
      0.84,
      'Experiment Agent',
    );

    expect(
      intelligenceCase.innovation.experiments[0]!.status,
    ).toBe('completed');
    expect(intelligenceCase.semanticMemory.lessons).toHaveLength(1);
    expect(intelligenceCase.status).toBe('optimizing');
  });

  it('pauses the case when risk becomes critical', () => {
    const nexus = createNexus();

    const intelligenceCase = nexus.create({
      name: 'Risk Test',
      objective: 'Validate critical risk behavior',
      owner: 'AVOS Media',
      domain: 'risk',
    });

    nexus.updateMetric(
      intelligenceCase.id,
      'riskExposure',
      0.9,
      'Risk Engine',
    );

    expect(intelligenceCase.status).toBe('paused');
    expect(intelligenceCase.commandNexus.alerts).toContain(
      'risk-exposure-critical',
    );
  });

  it('builds the executive command dashboard', () => {
    const nexus = createNexus();

    nexus.create({
      name: 'Portfolio Initiative A',
      objective: 'Test dashboard aggregation',
      owner: 'AVOS Media',
      domain: 'market',
      strategicFit: 0.8,
      expectedReturn: 0.75,
      risk: 0.2,
    });

    const dashboard = nexus.dashboard();

    expect(dashboard.totals.cases).toBe(1);
    expect(dashboard.totals.experiments).toBe(1);
    expect(dashboard.priorityQueue).toHaveLength(1);
  });
});