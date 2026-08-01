import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AudioIntelligenceService } from './audio/audio-intelligence.service';
import { CameraIntelligenceService } from './camera/camera-intelligence.service';
import { CharacterIntelligenceService } from './character/character-intelligence.service';
import {
  CreativeIntelligenceProgram,
  CreativeProjectBrief,
} from './creative-intelligence.types';
import { EditingIntelligenceService } from './editing/editing-intelligence.service';
import { LightingIntelligenceService } from './lighting/lighting-intelligence.service';
import { MusicIntelligenceService } from './music/music-intelligence.service';
import { CreativeQualityIntelligenceService } from './quality/creative-quality-intelligence.service';
import { ScriptIntelligenceService } from './script/script-intelligence.service';
import { StoryIntelligenceService } from './story/story-intelligence.service';
import { ThumbnailIntelligenceService } from './thumbnail/thumbnail-intelligence.service';
import { VisualStyleIntelligenceService } from './visual/visual-style-intelligence.service';
import { VoiceIntelligenceService } from './voice/voice-intelligence.service';
import { WorldBuildingIntelligenceService } from './world/world-building-intelligence.service';

@Injectable()
export class CreativeIntelligenceOrchestratorService {
  private readonly programs = new Map<string, CreativeIntelligenceProgram>();

  constructor(
    private readonly story: StoryIntelligenceService,
    private readonly script: ScriptIntelligenceService,
    private readonly character: CharacterIntelligenceService,
    private readonly world: WorldBuildingIntelligenceService,
    private readonly visual: VisualStyleIntelligenceService,
    private readonly camera: CameraIntelligenceService,
    private readonly lighting: LightingIntelligenceService,
    private readonly audio: AudioIntelligenceService,
    private readonly music: MusicIntelligenceService,
    private readonly voice: VoiceIntelligenceService,
    private readonly editing: EditingIntelligenceService,
    private readonly thumbnail: ThumbnailIntelligenceService,
    private readonly quality: CreativeQualityIntelligenceService,
  ) {}

  capabilities() {
    return {
      name: 'AVOS Creative Intelligence Mega Pack',
      version: 'CI-MEGA-1.0.0',
      systems: [
        'Story Intelligence Engine',
        'Script Intelligence Engine',
        'Character Intelligence Engine',
        'World Building Intelligence Engine',
        'Visual Style Intelligence Engine',
        'Camera Intelligence Engine',
        'Lighting Intelligence Engine',
        'Audio Intelligence Engine',
        'Music Intelligence Engine',
        'Voice Intelligence Engine',
        'Editing Intelligence Engine',
        'Thumbnail Intelligence Engine',
      ],
      governance: [
        'human-final-authority',
        'quality-gates',
        'audit-trail',
        'approval-before-activation',
      ],
    };
  }

  create(brief: CreativeProjectBrief) {
    const now = new Date().toISOString();
    const story = this.story.build(brief);
    const script = this.script.build(brief, story);
    const characters = this.character.build(brief, story);
    const world = this.world.build(brief);
    const visualStyle = this.visual.build(brief);
    const camera = this.camera.build(brief, script);
    const lighting = this.lighting.build(script, visualStyle);
    const audio = this.audio.build(script);
    const music = this.music.build(story, script);
    const voice = this.voice.build(brief, characters);
    const editing = this.editing.build(brief, script);
    const thumbnail = this.thumbnail.build(brief);

    const program: CreativeIntelligenceProgram = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      status: 'awaiting-human-approval',
      brief,
      story,
      script,
      characters,
      world,
      visualStyle,
      camera,
      lighting,
      audio,
      music,
      voice,
      editing,
      thumbnail,
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
            actor: 'Creative Intelligence Orchestrator',
            action: 'creative-program-created',
          },
        ],
      },
    };

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
      throw new NotFoundException(`Creative Intelligence program not found: ${id}`);
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
      throw new Error('Human approval and all quality gates are required.');
    }

    const now = new Date().toISOString();
    program.status = 'active';
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'creative-program-activated',
    });

    return program;
  }

  complete(id: string, actor: string) {
    const program = this.get(id);

    if (program.status !== 'active') {
      throw new Error('Program must be active before completion.');
    }

    const now = new Date().toISOString();
    program.status = 'completed';
    program.updatedAt = now;
    program.governance.auditTrail.push({
      at: now,
      actor,
      action: 'creative-program-completed',
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
        completed: items.filter((item) => item.status === 'completed').length,
        scenes: items.reduce((sum, item) => sum + item.script.scenes.length, 0),
        characters: items.reduce((sum, item) => sum + item.characters.length, 0),
        thumbnails: items.reduce((sum, item) => sum + item.thumbnail.concepts.length, 0),
      },
      programs: items.map((item) => ({
        id: item.id,
        title: item.brief.title,
        status: item.status,
        mode: item.visualStyle.mode,
        scenes: item.script.scenes.length,
        characters: item.characters.length,
        quality: item.quality.scores,
      })),
    };
  }
}