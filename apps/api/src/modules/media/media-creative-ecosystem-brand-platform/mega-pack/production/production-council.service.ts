import { Injectable } from '@nestjs/common';
import { CreativeBrief, ProductionStyle } from '../media-mega.types';

@Injectable()
export class ProductionCouncilService {
  convene(brief: CreativeBrief, style: ProductionStyle) {
    return [
      {
        agent: 'Executive Producer Agent',
        responsibility: 'scope-budget-deadline',
        decisionAuthority: ['budget-route', 'production-scope', 'resource-priority'],
        currentDecision: `authorize-${style}-planning`,
      },
      {
        agent: 'Director Agent',
        responsibility: 'creative-unity',
        decisionAuthority: ['performance', 'scene-language', 'emotional-arc'],
        currentDecision: 'lock-directorial-vision',
      },
      {
        agent: 'Screenwriter Agent',
        responsibility: 'story-and-dialogue',
        decisionAuthority: ['structure', 'dialogue', 'story-rhythm'],
        currentDecision: 'build-original-story-architecture',
      },
      {
        agent: 'Art Director Agent',
        responsibility: 'visual-language',
        decisionAuthority: ['palette', 'world-design', 'character-design'],
        currentDecision: 'lock-visual-bible',
      },
      {
        agent: 'Cinematography Agent',
        responsibility: 'camera-and-lighting',
        decisionAuthority: ['lens', 'movement', 'framing', 'lighting'],
        currentDecision: 'apply-platform-specific-cinematography',
      },
      {
        agent: 'Character Continuity Agent',
        responsibility: 'character-consistency',
        decisionAuthority: ['face', 'wardrobe', 'behavior', 'voice'],
        currentDecision: 'create-character-fingerprints',
      },
      {
        agent: 'Voice Director Agent',
        responsibility: 'voice-performance',
        decisionAuthority: ['casting', 'delivery', 'language-variants'],
        currentDecision: `prepare-${brief.languages?.length ?? 2}-language-voice-system`,
      },
      {
        agent: 'Music Supervisor Agent',
        responsibility: 'music-and-rights',
        decisionAuthority: ['score', 'themes', 'rights'],
        currentDecision: 'original-score-first',
      },
      {
        agent: 'Editor Agent',
        responsibility: 'editing-and-retention',
        decisionAuthority: ['cut', 'pacing', 'transitions'],
        currentDecision: 'protect-story-while-optimizing-retention',
      },
      {
        agent: 'Localization Agent',
        responsibility: 'language-and-culture',
        decisionAuthority: ['adaptation', 'dubbing', 'cultural-validation'],
        currentDecision: 'localize-meaning-not-words-only',
      },
      {
        agent: 'Rights Agent',
        responsibility: 'originality-and-clearance',
        decisionAuthority: ['copyright', 'license', 'usage'],
        currentDecision: 'block-unverified-assets',
      },
      {
        agent: 'Quality Agent',
        responsibility: 'final-quality',
        decisionAuthority: ['quality-gates', 'rejection', 'release-readiness'],
        currentDecision: 'require-human-final-approval',
      },
    ];
  }
}