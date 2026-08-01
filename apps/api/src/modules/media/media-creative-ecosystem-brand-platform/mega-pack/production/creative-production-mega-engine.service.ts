import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreativeBrief,
  CreativeProductionProgram,
} from '../media-mega.types';
import { ProductionBlueprintEngineService } from './production-blueprint-engine.service';
import { ProductionCouncilService } from './production-council.service';
import { ProductionIntelligenceAnalyzerService } from './production-intelligence-analyzer.service';
import { ProductionModelRouterService } from './production-model-router.service';
import { ProductionQualityEngineService } from './production-quality-engine.service';

@Injectable()
export class CreativeProductionMegaEngineService {
  private readonly programs = new Map<string, CreativeProductionProgram>();

  constructor(
    private readonly analyzer: ProductionIntelligenceAnalyzerService,
    private readonly router: ProductionModelRouterService,
    private readonly council: ProductionCouncilService,
    private readonly blueprint: ProductionBlueprintEngineService,
    private readonly qualityEngine: ProductionQualityEngineService,
  ) {}

  capabilities() {
    return {
      name: 'Creative Production Intelligence Engine Mega',
      version: 'CPIE-MEGA-2.0.0',
      phases: 36,
      capabilities: [
        'brief-analysis',
        'audience-intelligence',
        'platform-intelligence',
        'culture-intelligence',
        'style-selection',
        'model-routing',
        'production-council',
        'story-architecture',
        'scene-blueprints',
        'character-bible',
        'world-bible',
        'camera-direction',
        'lighting-direction',
        'voice-direction',
        'music-direction',
        'editing-direction',
        'continuity-control',
        'quality-gates',
        'rights-control',
        'localization',
        'learning-loop',
        'human-final-authority',
      ],
    };
  }

  create(brief: CreativeBrief) {
    const now = new Date().toISOString();
    const analysis = this.analyzer.analyze(brief);
    const style = analysis.selectedStyle;
    const program: CreativeProductionProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      intelligence: {
        audienceProfile: analysis.audienceProfile,
        platformProfile: analysis.platformProfile,
        culturalProfile: analysis.culturalProfile,
        riskProfile: analysis.riskProfile,
      },
      creativeStrategy: {
        selectedStyle: style,
        styleRationale: analysis.styleRationale,
        storyArchitecture: [
          'promise',
          'hook',
          'world-entry',
          'conflict-or-question',
          'progressive-discovery',
          'climax',
          'resolution',
          'next-experience',
        ],
        visualLanguage: [
          `${style}-global-studio-quality`,
          'recognizable-composition',
          'controlled-color-system',
          'character-first-continuity',
        ],
        emotionalArc: ['curiosity', 'connection', 'tension', 'revelation', 'satisfaction'],
      },
      modelRouting: this.router.route(brief, style),
      council: this.council.convene(brief, style),
      characterBible: this.blueprint.buildCharacterBible(brief),
      worldBible: this.blueprint.buildWorldBible(style),
      scenes: this.blueprint.buildScenes(brief, style),
      quality: {
        gates: [],
        scores: {},
        failures: [],
        approved: false,
      },
      localization: {
        languages: brief.languages ?? ['Arabic', 'English'],
        cultures: brief.cultures ?? [],
        adaptationRules: [
          'preserve-story-intent',
          'adapt-humor',
          'adapt-symbols',
          'adapt-voice-performance',
          'retain-brand-and-character-identity',
        ],
        localizedVersions: (brief.languages ?? ['Arabic', 'English']).map((language) => ({
          language,
          status: 'planned',
        })),
      },
      learning: {
        feedbackSignals: [
          'audience-retention',
          'completion-rate',
          'rewatch-rate',
          'quality-review',
          'localization-performance',
        ],
        retainedLessons: [],
        futureRecommendations: [
          'compare-style-performance',
          'compare-hook-performance',
          'compare-language-performance',
        ],
      },
      governance: {
        humanApproved: false,
        auditTrail: [
          {
            at: now,
            actor: 'Creative Production Intelligence Engine',
            action: 'program-created',
          },
        ],
      },
    };

    program.quality = this.qualityEngine.evaluate(program);
    this.programs.set(program.id, program);
    return program;
  }

  list() {
    return [...this.programs.values()];
  }

  get(id: string) {
    const program = this.programs.get(id);
    if (!program) throw new NotFoundException(`Creative production program not found: ${id}`);
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
    program.quality = this.qualityEngine.evaluate(program);
    return program;
  }

  activate(id: string, actor: string) {
    const program = this.get(id);
    if (!program.governance.humanApproved || !program.quality.approved) {
      throw new Error('Human approval and all quality gates are required.');
    }

    const now = new Date().toISOString();
    program.status = 'active';
    program.updatedAt = now;
    program.scenes = program.scenes.map((scene) => ({
      ...scene,
      status: 'generating',
    }));
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'production-activated',
    });
    return program;
  }

  completeScene(id: string, sceneId: string, actor: string) {
    const program = this.get(id);
    const scene = program.scenes.find((item) => item.id === sceneId);
    if (!scene) throw new NotFoundException(`Scene not found: ${sceneId}`);

    scene.status = 'approved';
    program.updatedAt = new Date().toISOString();
    program.governance.auditTrail.push({
      at: program.updatedAt,
      actor,
      action: 'scene-approved',
      details: { sceneId },
    });

    if (program.scenes.every((item) => item.status === 'approved')) {
      program.status = 'completed';
    }

    return program;
  }

  learn(id: string, lesson: string, actor: string) {
    const program = this.get(id);
    program.learning.retainedLessons.push(lesson);
    program.updatedAt = new Date().toISOString();
    program.governance.auditTrail.push({
      at: program.updatedAt,
      actor,
      action: 'lesson-retained',
      details: { lesson },
    });
    return program;
  }

  dashboard() {
    const items = this.list();
    return {
      capabilities: this.capabilities(),
      totals: {
        programs: items.length,
        active: items.filter((item) => item.status === 'active').length,
        completed: items.filter((item) => item.status === 'completed').length,
        scenes: items.reduce((sum, item) => sum + item.scenes.length, 0),
        approvedScenes: items.reduce(
          (sum, item) => sum + item.scenes.filter((scene) => scene.status === 'approved').length,
          0,
        ),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        status: item.status,
        style: item.creativeStrategy.selectedStyle,
        scenes: item.scenes.length,
        quality: item.quality.scores,
      })),
    };
  }
}