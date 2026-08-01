import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AiAgentTeamOrchestratorService } from './ai-agent-team-orchestrator.service';
import { CompetitiveIntelligenceEngineService } from './competitive-intelligence-engine.service';
import { DecisionEngineeringService } from './decision-engineering.service';
import { EnterpriseMemoryEngineService } from './enterprise-memory-engine.service';
import { FutureSimulationEngineService } from './future-simulation-engine.service';
import { IntelligenceObservabilityEngineService } from './intelligence-observability-engine.service';
import {
  IntelligenceCase,
  IntelligenceCaseStatus,
  IntelligenceSignalInput,
} from './media-intelligence-cloud.types';
import { PortfolioOptimizationEngineService } from './portfolio-optimization-engine.service';
import { PredictiveIntelligenceEngineService } from './predictive-intelligence-engine.service';
import { SignalRadarEngineService } from './signal-radar-engine.service';

@Injectable()
export class MediaIntelligenceCloudService {
  private readonly cases = new Map<string, IntelligenceCase>();

  constructor(
    private readonly radarEngine: SignalRadarEngineService,
    private readonly predictiveEngine: PredictiveIntelligenceEngineService,
    private readonly competitiveEngine: CompetitiveIntelligenceEngineService,
    private readonly decisionEngine: DecisionEngineeringService,
    private readonly portfolioEngine: PortfolioOptimizationEngineService,
    private readonly futureEngine: FutureSimulationEngineService,
    private readonly memoryEngine: EnterpriseMemoryEngineService,
    private readonly agentOrchestrator: AiAgentTeamOrchestratorService,
    private readonly observabilityEngine: IntelligenceObservabilityEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Intelligence Cloud',
      version: 'MIC-MEGA-1.0.0',
      operational: true,
      phases: [
        'Global Signal Radar',
        'Trend Detection',
        'Predictive Intelligence',
        'Competitive Intelligence',
        'Audience Intelligence',
        'Market Intelligence',
        'Platform Intelligence',
        'Technology Intelligence',
        'Revenue Intelligence',
        'Risk Intelligence',
        'Decision Engineering',
        'Portfolio Optimization',
        'Future Simulation',
        'Scenario Planning',
        'Enterprise Memory',
        'Living Knowledge',
        'Knowledge Relationships',
        'AI Agent Teams',
        'Agent Orchestration',
        'Task Assignment',
        'Observability',
        'Alerts',
        'Learning',
        'Human Decision Gate',
        'Intelligence Command Center',
        'Strategic Early Warning',
        'Opportunity Prioritization',
        'Execution Feedback Loop',
      ],
      humanFinalAuthority: true,
    };
  }

  create(input: IntelligenceSignalInput): IntelligenceCase {
    const now = new Date().toISOString();
    const radar = this.radarEngine.analyze(input);

    const intelligenceCase: IntelligenceCase = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status:
        radar.priority === 'low'
          ? 'detected'
          : 'awaiting-human-decision',
      input,
      radar,
      forecast: this.predictiveEngine.forecast(input),
      competitors: this.competitiveEngine.analyze(input),
      decisions: this.decisionEngine.build(
        input,
        radar.signalStrength,
      ),
      portfolio: this.portfolioEngine.score(input),
      futureSimulation: this.futureEngine.simulate(input),
      memory: this.memoryEngine.build(input),
      agents: this.agentOrchestrator.build(input),
      observability: this.observabilityEngine.build(),
      auditTrail: [`${now}:case-created:${input.source}`],
    };

    this.cases.set(intelligenceCase.id, intelligenceCase);
    return intelligenceCase;
  }

  list(): IntelligenceCase[] {
    return [...this.cases.values()];
  }

  get(id: string): IntelligenceCase {
    const intelligenceCase = this.cases.get(id);

    if (!intelligenceCase) {
      throw new NotFoundException(`Intelligence case not found: ${id}`);
    }

    return intelligenceCase;
  }

  approve(id: string, approvedBy: string): IntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.status = 'approved';
    intelligenceCase.updatedAt = now;
    intelligenceCase.decisions.humanApproved = true;
    intelligenceCase.decisions.approvedBy = approvedBy;
    intelligenceCase.decisions.approvedAt = now;
    intelligenceCase.auditTrail.push(
      `${now}:human-approved:${approvedBy}`,
    );

    return intelligenceCase;
  }

  advance(
    id: string,
    status: IntelligenceCaseStatus,
    actor: string,
  ): IntelligenceCase {
    const intelligenceCase = this.get(id);

    if (
      !intelligenceCase.decisions.humanApproved &&
      !['detected', 'analyzing', 'awaiting-human-decision'].includes(status)
    ) {
      throw new Error('Human decision approval is required.');
    }

    const now = new Date().toISOString();
    intelligenceCase.status = status;
    intelligenceCase.updatedAt = now;
    intelligenceCase.auditTrail.push(
      `${now}:advanced-to-${status}:${actor}`,
    );

    return intelligenceCase;
  }

  updateMetric(
    id: string,
    metric: string,
    value: number,
    actor: string,
  ): IntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.observability.metrics[metric] = value;
    intelligenceCase.updatedAt = now;
    intelligenceCase.auditTrail.push(
      `${now}:metric:${metric}:${value}:${actor}`,
    );

    if (value < 0.25) {
      intelligenceCase.observability.alerts.push(
        `${metric}:critical-low`,
      );
    }

    return intelligenceCase;
  }

  addLesson(
    id: string,
    lesson: string,
    actor: string,
  ): IntelligenceCase {
    const intelligenceCase = this.get(id);
    const now = new Date().toISOString();

    intelligenceCase.memory.lessons.push(lesson);
    intelligenceCase.status = 'learning';
    intelligenceCase.updatedAt = now;
    intelligenceCase.auditTrail.push(
      `${now}:lesson-added:${actor}`,
    );

    return intelligenceCase;
  }

  activateAgents(id: string): IntelligenceCase {
    const intelligenceCase = this.get(id);

    intelligenceCase.agents.assignments = intelligenceCase.agents.assignments.map(
      (assignment) => ({
        ...assignment,
        status: 'active',
      }),
    );

    intelligenceCase.status = 'analyzing';
    intelligenceCase.updatedAt = new Date().toISOString();
    intelligenceCase.auditTrail.push(
      `${intelligenceCase.updatedAt}:agents-activated`,
    );

    return intelligenceCase;
  }

  dashboard() {
    const cases = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        cases: cases.length,
        critical: cases.filter(
          (item) => item.radar.priority === 'critical',
        ).length,
        high: cases.filter(
          (item) => item.radar.priority === 'high',
        ).length,
        approved: cases.filter(
          (item) => item.decisions.humanApproved,
        ).length,
        executing: cases.filter(
          (item) => item.status === 'executing',
        ).length,
        alerts: cases.reduce(
          (sum, item) => sum + item.observability.alerts.length,
          0,
        ),
      },
      priorityQueue: cases
        .map((item) => ({
          id: item.id,
          title: item.input.title,
          domain: item.input.domain,
          signalStrength: item.radar.signalStrength,
          priority: item.radar.priority,
          forecastProbability: item.forecast.probability,
          expectedValue: item.forecast.expectedValue,
          status: item.status,
        }))
        .sort((a, b) => b.signalStrength - a.signalStrength),
    };
  }
}