import { Injectable } from '@nestjs/common';
import {
  CameraPlan,
  CreativeProjectBrief,
  ScriptPackage,
} from '../creative-intelligence.types';

@Injectable()
export class CameraIntelligenceService {
  build(
    brief: CreativeProjectBrief,
    script: ScriptPackage,
  ): CameraPlan {
    const vertical = this.isVertical(brief.platform);

    return {
      shots: script.scenes.map((scene, index) => ({
        sceneOrder: scene.order,
        shot: index === 0 ? 'hero-close-or-wide-reveal' : index === script.scenes.length - 1 ? 'resolution-wide-or-close' : 'story-motivated-shot',
        lens: index % 3 === 0 ? '24mm' : index % 3 === 1 ? '35mm' : '50mm',
        movement: index === 0 ? 'controlled-push-in' : 'motivated-dolly-pan-or-static',
        framing: vertical ? 'vertical-9:16-safe' : 'landscape-16:9-safe',
        purpose: scene.purpose,
      })),
      globalRules: [
        'camera movement must have narrative purpose',
        'maintain screen direction',
        'protect character eye-lines',
        'avoid random focal-length changes',
        'preserve platform-safe framing',
      ],
    };
  }

  private isVertical(platform: string) {
    const text = platform.toLowerCase();
    return text.includes('tiktok') || text.includes('reels') || text.includes('short');
  }
}