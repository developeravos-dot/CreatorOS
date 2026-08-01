import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreativeProductionInput,
  CreativeProductionPlan,
} from './media-creative.types';

@Injectable()
export class CreativeProductionIntelligenceEngineService {
  private readonly plans = new Map<string, CreativeProductionPlan>();

  capabilities() {
    return {
      name: 'Creative Production Intelligence Engine',
      version: 'CPIE-1.0.0',
      capabilities: [
        'audience-analysis',
        'style-selection',
        'model-selection',
        'script-planning',
        'art-direction',
        'cinematography',
        'voice-direction',
        'music-direction',
        'editing-direction',
        'quality-control',
        'visual-continuity',
        'audio-continuity',
        'localization',
        'continuous-learning',
        'human-final-authority',
      ],
    };
  }

  create(input: CreativeProductionInput): CreativeProductionPlan {
    const now = new Date().toISOString();
    const style = this.selectStyle(input);
    const scenes = this.buildScenes(input, style.primary);

    const plan: CreativeProductionPlan = {
      id: randomUUID(),
      createdAt: now,
      status: 'awaiting-human-approval',
      input,
      productionStyle: style,
      modelStrategy: {
        script: ['primary-language-model', 'script-critic-model'],
        image: ['concept-art-model', 'character-consistency-model'],
        video: ['cinematic-video-model', 'motion-control-model'],
        voice: ['multilingual-voice-model', 'voice-consistency-model'],
        music: ['adaptive-score-model', 'music-rights-checker'],
        editing: ['edit-decision-model', 'quality-restoration-model'],
      },
      story: {
        premise: `${input.title}: ${input.objective ?? 'original high-quality media production'}`,
        structure: ['hook', 'setup', 'development', 'climax', 'resolution', 'call-to-action'],
        scenes,
      },
      visualSystem: {
        palette: this.paletteFor(style.primary),
        typography: ['Primary Display', 'Readable Sans', 'Arabic Compatible Sans'],
        characterRules: [
          'fixed-character-bible',
          'fixed-face-proportions',
          'fixed-costume-logic',
          'approved-expression-range',
          'cross-scene-continuity',
        ],
        continuityRules: [
          'same-color-logic',
          'same-lens-language',
          'same-lighting-family',
          'same-character-identity',
          'same-environment-geography',
        ],
      },
      soundSystem: {
        voiceProfile: `${input.tone ?? 'professional'} voice for ${input.audience}`,
        musicDirection: `${style.primary} original adaptive score`,
        soundDesign: [
          'dialogue-clarity',
          'platform-loudness-compliance',
          'scene-transition-signatures',
          'spatial-depth',
        ],
      },
      productionCouncil: [
        { agent: 'Executive Producer Agent', role: 'budget-and-scope', decision: 'approve-controlled-production' },
        { agent: 'Director Agent', role: 'creative-direction', decision: `use-${style.primary}` },
        { agent: 'Screenwriter Agent', role: 'story-architecture', decision: 'six-stage-structure' },
        { agent: 'Art Director Agent', role: 'visual-language', decision: 'lock-visual-bible' },
        { agent: 'Cinematography Agent', role: 'camera-and-lighting', decision: 'apply-platform-specific-cinematography' },
        { agent: 'Voice Director Agent', role: 'voice-and-performance', decision: 'lock-voice-profile' },
        { agent: 'Music Supervisor Agent', role: 'music-and-rights', decision: 'original-score-only' },
        { agent: 'Editor Agent', role: 'editing-rhythm', decision: 'optimize-retention-without-damaging-story' },
        { agent: 'Quality Agent', role: 'final-quality', decision: 'run-all-quality-gates' },
        { agent: 'Localization Agent', role: 'language-and-culture', decision: 'localize-meaning-not-words-only' },
      ],
      qualityGates: [
        'originality-gate',
        'script-quality-gate',
        'character-consistency-gate',
        'visual-continuity-gate',
        'audio-continuity-gate',
        'cultural-safety-gate',
        'rights-clearance-gate',
        'platform-compliance-gate',
        'human-final-approval-gate',
      ],
      localization: {
        languages: input.languages ?? ['Arabic', 'English'],
        cultures: input.cultures ?? [],
        rules: [
          'preserve-story-intent',
          'adapt-humor-and-symbols',
          'localize-voice-performance',
          'validate-cultural-context',
          'retain-brand-consistency',
        ],
      },
      governance: {
        humanApproved: false,
        auditTrail: [`${now}:production-plan-created`],
      },
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  list() {
    return [...this.plans.values()];
  }

  get(id: string) {
    const plan = this.plans.get(id);
    if (!plan) throw new NotFoundException(`Production plan not found: ${id}`);
    return plan;
  }

  approve(id: string, approvedBy: string) {
    const plan = this.get(id);
    plan.status = 'approved';
    plan.governance.humanApproved = true;
    plan.governance.approvedBy = approvedBy;
    plan.governance.auditTrail.push(`${new Date().toISOString()}:approved:${approvedBy}`);
    return plan;
  }

  start(id: string, actor: string) {
    const plan = this.get(id);
    if (!plan.governance.humanApproved) {
      throw new Error('Human approval is required before production.');
    }
    plan.status = 'active';
    plan.governance.auditTrail.push(`${new Date().toISOString()}:production-started:${actor}`);
    return plan;
  }

  private selectStyle(input: CreativeProductionInput) {
    const value = `${input.contentType} ${input.audience} ${input.ageGroup} ${input.platform}`.toLowerCase();

    if (value.includes('kids') || value.includes('children')) {
      return {
        primary: 'animation' as const,
        secondary: 'stylized-3d',
        rationale: ['age-appropriate', 'high-character-control', 'strong-visual-recognition'],
      };
    }

    if (value.includes('anime')) {
      return {
        primary: 'anime' as const,
        rationale: ['genre-fit', 'audience-expectation', 'serial-character-potential'],
      };
    }

    if (value.includes('documentary') || value.includes('history')) {
      return {
        primary: 'hybrid' as const,
        secondary: 'cinematic-realism-plus-reconstruction',
        rationale: ['evidence-based', 'visual-reconstruction', 'narrative-depth'],
      };
    }

    if (value.includes('short') || value.includes('tiktok') || value.includes('reels')) {
      return {
        primary: 'cinematic' as const,
        secondary: 'fast-vertical-editing',
        rationale: ['platform-fit', 'retention', 'strong-hook'],
      };
    }

    return {
      primary: 'cinematic' as const,
      secondary: 'premium-global-studio',
      rationale: ['high-production-value', 'broad-platform-fit', 'brand-building'],
    };
  }

  private buildScenes(input: CreativeProductionInput, style: string) {
    const duration = Math.max(15, input.durationSeconds ?? 120);
    const count = Math.max(4, Math.min(12, Math.ceil(duration / 20)));

    return Array.from({ length: count }, (_, index) => ({
      scene: index + 1,
      purpose: index === 0 ? 'hook' : index === count - 1 ? 'resolution' : 'story-development',
      visualDirection: `${style}-scene-${index + 1}`,
      camera: index === 0 ? 'dynamic-opening-move' : 'controlled-story-driven-camera',
      lighting: index % 2 === 0 ? 'motivated-key-light' : 'cinematic-contrast-light',
      audio: index === 0 ? 'signature-opening-audio' : 'continuity-led-sound-design',
    }));
  }

  private paletteFor(style: CreativeProductionPlan['productionStyle']['primary']) {
    const palettes: Record<string, string[]> = {
      realistic: ['#1B1F24', '#D9D9D9', '#A67C52', '#F2E9E4'],
      cinematic: ['#0B132B', '#1C2541', '#C9A227', '#EAE0D5'],
      animation: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'],
      anime: ['#151515', '#E63946', '#F1FAEE', '#457B9D'],
      hybrid: ['#111827', '#7C3AED', '#22D3EE', '#F8FAFC'],
    };
    return palettes[style];
  }
}