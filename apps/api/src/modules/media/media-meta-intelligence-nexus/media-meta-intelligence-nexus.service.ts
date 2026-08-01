import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
import {
  MetaIntelligenceCase,
  MetaIntelligenceInput,
  NexusStatus,
} from './meta-intelligence.types';
import { OpportunityGraphEngineService } from './opportunity-graph-engine.service';
import { PortfolioEvolutionEngineService } from './portfolio-evolution-engine.service';
import { PredictiveOpportunityRiskEngineService } from './predictive-opportunity-risk-engine.service';
import { ScenarioMatrixEngineService } from './scenario-matrix-engine.service';
import { SelfOptimizationEngineService } from './self-optimization-engine.service';
import { SemanticMemoryEngineService } from './semantic-memory-engine.service';
import { SimulationGridEngineService } from './simulation-grid-engine.service';
import { TrendIntelligenceEngineService } from './trend-intelligence-engine.service';
import { WorldModelEngineService } from './world-model-engine.service';

@Injectable()
export class MediaMetaIntelligenceNexusService {
  private readonly cases = new Map<string, MetaIntelligenceCase>();

  constructor(
    private readonly knowledgeFabric: KnowledgeFabricEngineService,
    private readonly worldModel: WorldModelEngineService,
    private readonly semanticMemory: SemanticMemoryEngineService,
    private readonly crossProject: CrossProjectIntelligenceEngineService,
    private readonly opportunityGraph: OpportunityGraphEngineService,
    private readonly innovationLab: InnovationLabEngineService,
    private readonly evidenceRanking: EvidenceRankingEngineService,
    private readonly scenarioMatrix: ScenarioMatrixEngineService,
    private readonly trendIntelligence: TrendIntelligenceEngineService,
    private readonly enterpriseDna: EnterpriseDnaEngineService,
    private readonly digitalOrganization: DigitalOrganizationBrainService,
    private readonly capabilityEvolution: CapabilityEvolutionEngineService,
    private readonly optimization: SelfOptimizationEngineService,
    private readonly simulationGrid: SimulationGridEngineService,
    private readonly eventCorrelation: GlobalEventCorrelationEngineService,
    private readonly predictiveRadar: PredictiveOpportunityRiskEngineService,
    private readonly adaptiveWorkflow: AdaptiveWorkflowEngineService,
    private readonly reasoning: CrossDomainReasoningEngineService,
    private readonly portfolio: PortfolioEvolutionEngineService,
    private readonly ecosystem: EcosystemIntelligenceEngineService,
    private readonly autonomousPlanning: AutonomousPlanningEngineService,
    private readonly commandNexus: ExecutiveCommandNexusEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Meta Intelligence Nexus',
      version: 'MMIN-32-1.0.0',
      operational: true,
      phases: [
        'Global Knowledge Fabric',
        'World Model Engine',
        'Semantic Memory Graph',
        'Cross-Project Intelligence',
        'Opportunity Graph',
        'Innovation Discovery Engine',
        'AI Research Laboratory',
        'Experiment Orchestrator',
        'Autonomous Hypothesis Engine',
        'Evidence Ranking',
        'Strategic Scenario Matrix',
        'Macro Trend Intelligence',
        'Micro Trend Intelligence',
        'Enterprise DNA Engine',
        'Business Genome',
        'Digital Organization Brain',
        'AI Executive Council',
        'Capability Evolution Engine',
        'Self-Optimization Engine',
        'Resource Optimizer',
        'Enterprise Simulation Grid',
        'Global Event Correlation',
        'Predictive Opportunity Radar',
        'Risk Prediction Engine',
        'Adaptive Workflow Engine',
        'Cross-Domain Reasoning',
        'Knowledge Validation',
        'Portfolio Evolution',
        'Ecosystem Intelligence',
        'Autonomous Planning',
        'Executive Command Nexus',
        'Human Final Authority Gate',
      ],
      humanFinalAuthority: true,
    };
  }

  create(input: MetaIntelligenceInput): MetaIntelligenceCase {
    const now = new Date().toISOString();
    const evidence = this.evidenceRanking.rank(input);
    const scenarios = this.scenarioMatrix.simulate(input);
    const portfolio = this.portfolio.score(input);
    const predictiveRadar = this.predictiveRadar.analyze(input);

    const intelligenceCase: MetaIntelligenceCase = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      input,
      knowledgeFabric: this.knowledgeFabric.build(input),
      worldModel: this.worldModel.build(input),
      semanticMemory: this.semanticMemory.build(input),
      crossProjectIntelligence: this.crossProject.build(input),
      opportunityGraph: this.opportunityGraph.build(input),
      innovation: this.innovationLab.build(input),
      evidence,
      scenarios,
      trendIntelligence: this.trendIntelligence.analyze(input),
      enterpriseDna: this.enterpriseDna.build(input),
      digitalOrganization: this.digitalOrganization.build(input),
      capabilityEvolution: this.capabilityEvolution.evaluate(input),
      optimization: this.optimization.optimize(input),
      simulationGrid: this.simulationGrid.build(scenarios),
      eventCorrelation: this.eventCorrelation.correlate(input),
      predictiveRadar,
      adaptiveWorkflow: this.adaptiveWorkflow.build(),
      reasoning: this.reasoning.reason(input),
      portfolio,
      ecosystem: this.ecosystem.build(input),
      autonomousPlan: this.autonomousPlanning.build(),
      governance: {
        humanApproved: false,
        finalAuthority: 'human',
        auditTrail: [`${now}:case-created:${input.owner}`],
      },
      commandNexus: this.commandNexus.build(),
    };

    intelligenceCase.commandNexus.metrics = {
      intelligenceConfidence: evidence.aggregateScore,
      evidenceCoverage: evidence.items.length > 0 ? 1 : 0.25,
      strategicValue: portfolio.priorityScore,
      executionProgress: 0,
      realizedValue: 0,
      riskExposure: predictiveRadar.riskScore,
    };

    intelligenceCase.commandNexus.recommendations = [
      intelligenceCase.opportunityGraph.opportunities[0]?.title ??
        'collect-more-evidence',
      predictiveRadar.opportunityScore > predictiveRadar.riskScore
        ? 'prepare-controlled-pilot'
        : 'reduce-risk-before-pilot',
    ];

    this.cases.set(intelligenceCase.id, intelligenceCase);
    return intelligenceCase;
  }

  list(): MetaIntelligenceCase[] {
    return [...this.cases.values()];
  }

  get(id: string): MetaIntelligenceCase {
    const intelligenceCase = this.cases.get(id);

    if (!intelligenceCase) {
      throw new NotFoundException(`Meta intelligence case not found: ${id}`);
    }

    return intelligenceCase;
  }

  approve(id: string, approvedBy: string): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.status = 'approved';
    intelligenceCase.updatedAt = now;
    intelligenceCase.governance.humanApproved = true;
    intelligenceCase.governance.approvedBy = approvedBy;
    intelligenceCase.governance.approvedAt = now;
    intelligenceCase.governance.auditTrail.push(
      `${now}:human-approved:${approvedBy}`,
    );
    intelligenceCase.adaptiveWorkflow.currentStage = 'plan';
    intelligenceCase.adaptiveWorkflow.nextActions = [
      'activate-workstreams',
      'approve-experiment',
      'start-observability',
    ];

    return intelligenceCase;
  }

  advance(
    id: string,
    status: NexusStatus,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);

    if (
      !intelligenceCase.governance.humanApproved &&
      !['draft', 'analyzing', 'awaiting-human-approval'].includes(status)
    ) {
      throw new Error('Human approval is required before planning or execution.');
    }

    const now = new Date().toISOString();
    intelligenceCase.status = status;
    intelligenceCase.updatedAt = now;
    intelligenceCase.governance.auditTrail.push(
      `${now}:advanced-to-${status}:${actor}`,
    );

    return intelligenceCase;
  }

  approveExperiment(
    id: string,
    experimentId: string,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);

    if (!intelligenceCase.governance.humanApproved) {
      throw new Error('Human approval is required before experiment approval.');
    }

    const experiment = intelligenceCase.innovation.experiments.find(
      (item) => item.id === experimentId,
    );

    if (!experiment) {
      throw new NotFoundException(`Experiment not found: ${experimentId}`);
    }

    experiment.status = 'approved';
    intelligenceCase.updatedAt = new Date().toISOString();
    intelligenceCase.governance.auditTrail.push(
      `${intelligenceCase.updatedAt}:experiment-approved:${experimentId}:${actor}`,
    );

    return intelligenceCase;
  }

  startExperiment(
    id: string,
    experimentId: string,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);
    const experiment = intelligenceCase.innovation.experiments.find(
      (item) => item.id === experimentId,
    );

    if (!experiment) {
      throw new NotFoundException(`Experiment not found: ${experimentId}`);
    }

    if (experiment.status !== 'approved') {
      throw new Error('Experiment must be approved before starting.');
    }

    experiment.status = 'running';
    intelligenceCase.status = 'executing';
    intelligenceCase.updatedAt = new Date().toISOString();
    intelligenceCase.governance.auditTrail.push(
      `${intelligenceCase.updatedAt}:experiment-started:${experimentId}:${actor}`,
    );

    return intelligenceCase;
  }

  completeExperiment(
    id: string,
    experimentId: string,
    result: number,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);
    const experiment = intelligenceCase.innovation.experiments.find(
      (item) => item.id === experimentId,
    );

    if (!experiment) {
      throw new NotFoundException(`Experiment not found: ${experimentId}`);
    }

    experiment.result = result;
    experiment.status =
      result >= experiment.successThreshold ? 'completed' : 'failed';

    const lesson =
      experiment.status === 'completed'
        ? `Experiment ${experiment.name} validated the hypothesis`
        : `Experiment ${experiment.name} did not meet its threshold`;

    intelligenceCase.semanticMemory.lessons.push(lesson);
    intelligenceCase.status = 'optimizing';
    intelligenceCase.updatedAt = new Date().toISOString();
    intelligenceCase.commandNexus.metrics.realizedValue = result;
    intelligenceCase.governance.auditTrail.push(
      `${intelligenceCase.updatedAt}:experiment-completed:${experimentId}:${result}:${actor}`,
    );

    return intelligenceCase;
  }

  updateMetric(
    id: string,
    metric: string,
    value: number,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.commandNexus.metrics[metric] = value;
    intelligenceCase.updatedAt = now;
    intelligenceCase.governance.auditTrail.push(
      `${now}:metric:${metric}:${value}:${actor}`,
    );

    if (metric === 'riskExposure' && value > 0.75) {
      intelligenceCase.commandNexus.alerts.push(
        'risk-exposure-critical',
      );
      intelligenceCase.status = 'paused';
    }

    return intelligenceCase;
  }

  addLesson(
    id: string,
    lesson: string,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.semanticMemory.lessons.push(lesson);
    intelligenceCase.updatedAt = now;
    intelligenceCase.governance.auditTrail.push(
      `${now}:lesson-added:${actor}`,
    );

    return intelligenceCase;
  }

  addBlocker(
    id: string,
    blocker: string,
    actor: string,
  ): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.adaptiveWorkflow.blockers.push(blocker);
    intelligenceCase.status = 'paused';
    intelligenceCase.updatedAt = now;
    intelligenceCase.commandNexus.alerts.push(`blocker:${blocker}`);
    intelligenceCase.governance.auditTrail.push(
      `${now}:blocker-added:${blocker}:${actor}`,
    );

    return intelligenceCase;
  }

  activatePlan(id: string, actor: string): MetaIntelligenceCase {
    const intelligenceCase = this.get(id);

    if (!intelligenceCase.governance.humanApproved) {
      throw new Error('Human approval is required before plan activation.');
    }

    intelligenceCase.autonomousPlan.workstreams =
      intelligenceCase.autonomousPlan.workstreams.map((workstream) => ({
        ...workstream,
        status: 'active',
      }));

    intelligenceCase.status = 'planning';
    intelligenceCase.adaptiveWorkflow.currentStage = 'plan';
    intelligenceCase.updatedAt = new Date().toISOString();
    intelligenceCase.governance.auditTrail.push(
      `${intelligenceCase.updatedAt}:plan-activated:${actor}`,
    );

    return intelligenceCase;
  }

  dashboard() {
    const cases = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        cases: cases.length,
        approved: cases.filter((item) => item.governance.humanApproved).length,
        executing: cases.filter((item) => item.status === 'executing').length,
        optimizing: cases.filter((item) => item.status === 'optimizing').length,
        paused: cases.filter((item) => item.status === 'paused').length,
        alerts: cases.reduce(
          (sum, item) => sum + item.commandNexus.alerts.length,
          0,
        ),
        experiments: cases.reduce(
          (sum, item) => sum + item.innovation.experiments.length,
          0,
        ),
      },
      priorityQueue: cases
        .map((item) => ({
          id: item.id,
          name: item.input.name,
          domain: item.input.domain,
          priorityScore: item.portfolio.priorityScore,
          opportunityScore: item.predictiveRadar.opportunityScore,
          riskScore: item.predictiveRadar.riskScore,
          evidenceScore: item.evidence.aggregateScore,
          status: item.status,
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore),
    };
  }
}