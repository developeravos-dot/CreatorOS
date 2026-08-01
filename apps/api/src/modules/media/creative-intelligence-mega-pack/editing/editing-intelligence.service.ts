import { Injectable } from '@nestjs/common';
import {
  CreativeProjectBrief,
  EditingPlan,
  ScriptPackage,
} from '../creative-intelligence.types';

@Injectable()
export class EditingIntelligenceService {
  build(
    brief: CreativeProjectBrief,
    script: ScriptPackage,
  ): EditingPlan {
    return {
      pacing: this.pacingFor(brief.platform),
      sceneCuts: script.scenes.map((scene, index) => ({
        sceneOrder: scene.order,
        entry: index === 0 ? 'cold-open-or-impact-entry' : 'motivated-entry',
        exit: index === script.scenes.length - 1 ? 'resolved-end-frame' : 'open-loop-or-motivated-cut',
        transition: index % 4 === 0 ? 'hard-cut' : index % 4 === 1 ? 'sound-bridge' : index % 4 === 2 ? 'match-cut' : 'controlled-dissolve',
        retentionPurpose: scene.purpose === 'hook' ? 'capture-attention' : scene.purpose === 'resolution' ? 'deliver-satisfaction' : 'sustain-curiosity',
      })),
      platformVariants: [
        {
          platform: brief.platform,
          format: this.formatFor(brief.platform),
          durationStrategy: 'primary-master',
        },
        {
          platform: 'Short-form',
          format: '9:16',
          durationStrategy: 'hook-first-compressed-cut',
        },
        {
          platform: 'Social-square',
          format: '1:1',
          durationStrategy: 'caption-safe-promotional-cut',
        },
      ],
    };
  }

  private pacingFor(platform: string) {
    const text = platform.toLowerCase();
    return text.includes('tiktok') || text.includes('reels') || text.includes('short')
      ? 'fast-retention-optimized'
      : 'story-driven-cinematic';
  }

  private formatFor(platform: string) {
    const text = platform.toLowerCase();
    return text.includes('tiktok') || text.includes('reels') || text.includes('short')
      ? '9:16'
      : '16:9';
  }
}