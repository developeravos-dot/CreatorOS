import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MediaAnalyticsIntelligenceService } from './analytics/media-analytics-intelligence.service';
import { MediaDigitalDnaService } from './digital-dna/media-digital-dna.service';
import { AutonomousImprovementIntelligenceService } from './improvement/autonomous-improvement-intelligence.service';
import {
  IntelligenceCoreBrief,
  IntelligenceCoreProgram,
} from './intelligence-core.types';
import { MediaKnowledgeGraphService } from './knowledge-graph/media-knowledge-graph.service';
import { MediaLearningIntelligenceService } from './learning/media-learning-intelligence.service';
import { MediaMemoryIntelligenceService } from './memory/media-memory-intelligence.service';
import { IntelligenceCoreQualityService } from './quality/intelligence-core-quality.service';

@Injectable()
export class IntelligenceCoreOrchestratorService {
  private readonly programs = new Map<string, IntelligenceCoreProgram>();

  constructor(
    private readonly analytics: MediaAnalyticsIntelligenceService,
    private readonly learning: MediaLearningIntelligenceService,
    private readonly improvement: AutonomousImprovementIntelligenceService,
    private readonly knowledgeGraph: MediaKnowledgeGraphService,
    private readonly memory: MediaMemoryIntelligenceService,
    private readonly digitalDna: MediaDigitalDnaService,
    private readonly quality: IntelligenceCoreQualityService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Media Intelligence Core Mega Pack',
      version: 'MIC-MEGA-1.0.0',
      systems: [
        'Media Analytics Intelligence Engine',
        'Media Learning Intelligence Engine',
        'Autonomous Improvement Engine',
        'Media Knowledge Graph',
        'Media Memory Intelligence',
        'Media Digital DNA Engine',
      ],
      governance: [
        'human-final-authority',
        'protected-principles',
        'proposal-before-mutation',
        'rollback-ready',
        'audit-trail',
      ],
    };
  }

  create(brief: IntelligenceCoreBrief) {
    const now = new Date().toISOString();
    const baseline = this.analytics.createBaseline(brief);

    const program: IntelligenceCoreProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      analytics: [baseline],
      learnings: [],
      improvements: [],
      knowledgeGraph: this.knowledgeGraph.build(brief),
      memory: [],
      digitalDna: this.digitalDna.build(brief),
      quality: {
        scores: {},
        failures: [],
        approved: false,
      },
      governance: {
        humanApproved: false,
        auditTrail: [
          {
            at: now,
            actor: 'Intelligence Core Orchestrator',
            action: 'intelligence-core-created',
          },
        ],
      },
    };

    program.improvements = this.improvement.propose(
      baseline,
      program.learnings,
    );
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
      throw new NotFoundException(
        `Intelligence Core program not found: ${id}`,
      );
    }

    return program;
  }

  approve(id: string, approvedBy: string) {
    const program = this.get(id);
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

    if (!program.governance.humanApproved || !program.quality.approved) {
      throw new Error(
        'Human approval and all intelligence quality gates are required.',
      );
    }

    const now = new Date().toISOString();
    program.status = 'active';
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'intelligence-core-activated',
    });

    return program;
  }

  recordAnalytics(
    id: string,
    updates: Record<string, number>,
    actor: string,
  ) {
    const program = this.get(id);
    const previous =
      program.analytics[program.analytics.length - 1] ??
      this.analytics.createBaseline(program.brief);
    const snapshot = this.analytics.analyze(previous, updates);
    const now = new Date().toISOString();

    program.analytics.push(snapshot);
    program.improvements = this.improvement.propose(
      snapshot,
      program.learnings,
    );
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'analytics-recorded',
      details: updates,
    });

    return program;
  }

  learn(
    id: string,
    source: string,
    observation: string,
    confidence: number,
    actor: string,
  ) {
    const program = this.get(id);
    const learning = this.learning.create(
      source,
      observation,
      confidence,
    );
    const latestAnalytics =
      program.analytics[program.analytics.length - 1] ??
      this.analytics.createBaseline(program.brief);
    const now = new Date().toISOString();

    program.learnings.push(learning);
    program.improvements = this.improvement.propose(
      latestAnalytics,
      program.learnings,
    );
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'learning-recorded',
      details: {
        learningId: learning.id,
        confidence: learning.confidence,
      },
    });

    return learning;
  }

  remember(
    id: string,
    category: string,
    summary: string,
    source: string,
    tags: string[],
    importance: number,
    actor: string,
  ) {
    const program = this.get(id);
    const memory = this.memory.remember(
      category,
      summary,
      source,
      tags,
      importance,
    );
    const now = new Date().toISOString();

    program.memory.push(memory);
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'memory-recorded',
      details: {
        memoryId: memory.id,
      },
    });

    return memory;
  }

  searchMemory(id: string, query: string) {
    return this.memory.search(this.get(id).memory, query);
  }

  approveImprovement(
    id: string,
    improvementId: string,
    approvedBy: string,
  ) {
    const program = this.get(id);
    const proposal = program.improvements.find(
      (item) => item.id === improvementId,
    );

    if (!proposal) {
      throw new NotFoundException(
        `Improvement proposal not found: ${improvementId}`,
      );
    }

    proposal.status = 'human-approved';
    const now = new Date().toISOString();
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor: approvedBy,
      action: 'improvement-approved',
      details: {
        improvementId,
      },
    });

    return proposal;
  }

  dashboard() {
    const items = this.list();

    return {
      capabilities: this.capabilities(),
      totals: {
        programs: items.length,
        approved: items.filter(
          (item) => item.governance.humanApproved,
        ).length,
        active: items.filter(
          (item) => item.status === 'active',
        ).length,
        analyticsSnapshots: items.reduce(
          (sum, item) => sum + item.analytics.length,
          0,
        ),
        learnings: items.reduce(
          (sum, item) => sum + item.learnings.length,
          0,
        ),
        improvements: items.reduce(
          (sum, item) => sum + item.improvements.length,
          0,
        ),
        knowledgeNodes: items.reduce(
          (sum, item) => sum + item.knowledgeGraph.nodes.length,
          0,
        ),
        memories: items.reduce(
          (sum, item) => sum + item.memory.length,
          0,
        ),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        projectId: item.brief.projectId,
        status: item.status,
        analyticsSnapshots: item.analytics.length,
        learnings: item.learnings.length,
        improvements: item.improvements.length,
        knowledgeNodes: item.knowledgeGraph.nodes.length,
        memories: item.memory.length,
        digitalDnaVersion: item.digitalDna.version,
        qualityApproved: item.quality.approved,
      })),
    };
  }
}