import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AudienceIntelligenceService } from './audience/audience-intelligence.service';
import {
  AudienceDistributionProgram,
  DistributionBrief,
} from './audience-distribution.types';
import { CulturalIntelligenceService } from './culture/cultural-intelligence.service';
import { GlobalLocalizationService } from './localization/global-localization.service';
import { PublishingIntelligenceService } from './publishing/publishing-intelligence.service';
import { ContentQualityIntelligenceService } from './quality/content-quality-intelligence.service';
import { ContentSafetyIntelligenceService } from './safety/content-safety-intelligence.service';
import { TrendIntelligenceService } from './trend/trend-intelligence.service';

@Injectable()
export class AudienceDistributionOrchestratorService {
  private readonly programs = new Map<string, AudienceDistributionProgram>();

  constructor(
    private readonly trend: TrendIntelligenceService,
    private readonly audience: AudienceIntelligenceService,
    private readonly publishing: PublishingIntelligenceService,
    private readonly localization: GlobalLocalizationService,
    private readonly culture: CulturalIntelligenceService,
    private readonly quality: ContentQualityIntelligenceService,
    private readonly safety: ContentSafetyIntelligenceService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Audience & Distribution Mega Pack',
      version: 'AD-MEGA-1.0.0',
      systems: [
        'Publishing Intelligence Engine',
        'Trend Intelligence Engine',
        'Audience Intelligence Engine',
        'Global Localization Engine',
        'Cultural Intelligence Engine',
        'Content Quality Intelligence Engine',
        'Content Safety Intelligence Engine',
      ],
      governance: [
        'human-final-authority',
        'quality-gates',
        'safety-gates',
        'risk-pause',
        'audit-trail',
      ],
    };
  }

  create(brief: DistributionBrief) {
    const now = new Date().toISOString();

    const program: AudienceDistributionProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      trends: this.trend.analyze(brief),
      audienceSegments: this.audience.segment(brief),
      publishing: this.publishing.build(brief),
      localization: this.localization.build(brief),
      culturalReview: this.culture.review(brief),
      quality: {
        scores: {},
        failures: [],
        approved: false,
      },
      safety: this.safety.review(brief),
      analytics: {
        metrics: {
          reach: 0,
          impressions: 0,
          views: 0,
          retention: 0,
          engagement: 0,
          conversion: 0,
          audienceGrowth: 0,
          localizationPerformance: 0,
        },
        alerts: [],
        learnings: [],
      },
      governance: {
        humanApproved: false,
        auditTrail: [
          {
            at: now,
            actor: 'Audience Distribution Orchestrator',
            action: 'distribution-program-created',
          },
        ],
      },
    };

    if (!program.safety.safeForDistribution) {
      program.status = 'paused';
      program.analytics.alerts.push('distribution-paused-for-safety-risk');
    }

    program.quality = this.quality.evaluate(program);
    this.programs.set(program.id, program);
    return program;
  }

  list() {
    return [...this.programs.values()];
  }

  get(id: string) {
    const program = this.programs.get(id);

    if (!program) {
      throw new NotFoundException(`Audience Distribution program not found: ${id}`);
    }

    return program;
  }

  approve(id: string, approvedBy: string) {
    const program = this.get(id);

    if (!program.safety.safeForDistribution) {
      throw new Error('Safety review must pass before human approval.');
    }

    const now = new Date().toISOString();
    program.status = 'approved';
    program.updatedAt = now;
    program.governance.humanApproved = true;
    program.governance.approvedBy = approvedBy;
    program.governance.approvedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor: approvedBy,
      action: 'human-approved',
    });

    program.quality = this.quality.evaluate(program);
    return program;
  }

  activate(id: string, actor: string) {
    const program = this.get(id);

    if (
      !program.governance.humanApproved ||
      !program.quality.approved ||
      !program.safety.safeForDistribution
    ) {
      throw new Error(
        'Human approval, quality approval and safety approval are required.',
      );
    }

    const now = new Date().toISOString();
    program.status = 'active';
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'distribution-activated',
    });

    return program;
  }

  updateMetric(
    id: string,
    metric: string,
    value: number,
    actor: string,
  ) {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.analytics.metrics[metric] = value;
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'distribution-metric-updated',
      details: { metric, value },
    });

    if (metric === 'riskExposure' && value > 0.75) {
      program.status = 'paused';
      program.analytics.alerts.push('critical-distribution-risk');
    }

    return program;
  }

  retainLearning(id: string, learning: string, actor: string) {
    const program = this.get(id);
    const now = new Date().toISOString();

    program.analytics.learnings.push(learning);
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'distribution-learning-retained',
      details: { learning },
    });

    return program;
  }

  dashboard() {
    const items = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        programs: items.length,
        approved: items.filter((item) => item.governance.humanApproved).length,
        active: items.filter((item) => item.status === 'active').length,
        paused: items.filter((item) => item.status === 'paused').length,
        platforms: items.reduce(
          (sum, item) => sum + item.publishing.platforms.length,
          0,
        ),
        markets: items.reduce(
          (sum, item) => sum + item.culturalReview.markets.length,
          0,
        ),
        languages: items.reduce(
          (sum, item) => sum + item.localization.targets.length,
          0,
        ),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        status: item.status,
        platforms: item.publishing.platforms.length,
        markets: item.culturalReview.markets.length,
        languages: item.localization.targets.length,
        safeForDistribution: item.safety.safeForDistribution,
        qualityApproved: item.quality.approved,
      })),
    };
  }
}