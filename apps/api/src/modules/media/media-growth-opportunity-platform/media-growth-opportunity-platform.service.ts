import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AutonomousGrowthEngineService } from './autonomous-growth-engine.service';
import { ContentInvestmentEngineService } from './content-investment-engine.service';
import {
  MediaOpportunity,
  OpportunitySignalInput,
} from './media-growth-opportunity.types';
import { OpportunityRadarService } from './opportunity-radar.service';

@Injectable()
export class MediaGrowthOpportunityPlatformService {
  private readonly opportunities = new Map<string, MediaOpportunity>();

  constructor(
    private readonly radar: OpportunityRadarService,
    private readonly investment: ContentInvestmentEngineService,
    private readonly growth: AutonomousGrowthEngineService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Growth and Opportunity Intelligence Platform',
      operational: true,
      systems: [
        'Opportunity Radar',
        'Content Investment Engine',
        'Autonomous Growth Engine',
        'Experiment Governance',
        'Human Final Authority',
        'Learning and Reprioritization',
      ],
      humanFinalAuthority: true,
    };
  }

  dashboard() {
    const opportunities = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        opportunities: opportunities.length,
        awaitingApproval: opportunities.filter(
          (item) => item.status === 'awaiting-human-approval',
        ).length,
        approved: opportunities.filter(
          (item) => item.status === 'approved',
        ).length,
        experimenting: opportunities.filter(
          (item) => item.status === 'experimenting',
        ).length,
        scaling: opportunities.filter(
          (item) => item.status === 'scaling',
        ).length,
      },
      priorityQueue: opportunities
        .filter((item) => item.score.recommendation === 'prioritize')
        .sort((a, b) => b.score.total - a.score.total)
        .map((item) => ({
          id: item.id,
          title: item.input.title,
          score: item.score.total,
          status: item.status,
        })),
    };
  }

  create(input: OpportunitySignalInput): MediaOpportunity {
    const now = new Date().toISOString();
    const score = this.radar.score(input);

    const opportunity: MediaOpportunity = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status:
        score.recommendation === 'reject'
          ? 'rejected'
          : 'awaiting-human-approval',
      input,
      score,
      investmentCase: this.investment.build(input, score),
      growthPlaybook: this.growth.build(input),
      approvals: {
        approved: false,
      },
      experiment: {
        launched: false,
      },
      learning: [],
    };

    this.opportunities.set(opportunity.id, opportunity);
    return opportunity;
  }

  list(): MediaOpportunity[] {
    return [...this.opportunities.values()];
  }

  get(id: string): MediaOpportunity {
    const opportunity = this.opportunities.get(id);

    if (!opportunity) {
      throw new NotFoundException(`Media opportunity not found: ${id}`);
    }

    return opportunity;
  }

  approve(id: string, approvedBy: string): MediaOpportunity {
    const opportunity = this.get(id);

    if (opportunity.status === 'rejected') {
      throw new Error('Rejected opportunity cannot be approved without reevaluation.');
    }

    opportunity.approvals = {
      approved: true,
      approvedBy,
      approvedAt: new Date().toISOString(),
    };
    opportunity.status = 'approved';
    opportunity.updatedAt = new Date().toISOString();

    return opportunity;
  }

  launchExperiment(
    id: string,
    hypothesis: string,
    successMetric: string,
    targetValue: number,
  ): MediaOpportunity {
    const opportunity = this.get(id);

    if (!opportunity.approvals.approved) {
      throw new Error('Human approval is required before experiment launch.');
    }

    opportunity.experiment = {
      launched: true,
      hypothesis,
      successMetric,
      targetValue,
    };
    opportunity.status = 'experimenting';
    opportunity.updatedAt = new Date().toISOString();

    return opportunity;
  }

  recordResult(id: string, actualValue: number): MediaOpportunity {
    const opportunity = this.get(id);

    if (!opportunity.experiment.launched) {
      throw new Error('Experiment must be launched before recording a result.');
    }

    opportunity.experiment.actualValue = actualValue;

    const target = opportunity.experiment.targetValue ?? 1;
    const normalized = Math.max(0, Math.min(1, actualValue / target));
    const decision =
      normalized >= 1
        ? 'submit-for-human-scale-approval'
        : normalized >= 0.7
          ? 'continue-controlled-experiment'
          : 'redesign-or-stop';

    opportunity.learning.push({
      at: new Date().toISOString(),
      signal: opportunity.experiment.successMetric ?? 'experiment-result',
      value: normalized,
      decision,
    });

    opportunity.updatedAt = new Date().toISOString();
    return opportunity;
  }

  scale(id: string): MediaOpportunity {
    const opportunity = this.get(id);
    const latest = opportunity.learning.at(-1);

    if (!opportunity.approvals.approved) {
      throw new Error('Human approval is required before scaling.');
    }

    if (!latest || latest.decision !== 'submit-for-human-scale-approval') {
      throw new Error('Successful experiment evidence is required before scaling.');
    }

    opportunity.status = 'scaling';
    opportunity.updatedAt = new Date().toISOString();

    return opportunity;
  }

  pause(id: string): MediaOpportunity {
    const opportunity = this.get(id);
    opportunity.status = 'paused';
    opportunity.updatedAt = new Date().toISOString();
    return opportunity;
  }
}