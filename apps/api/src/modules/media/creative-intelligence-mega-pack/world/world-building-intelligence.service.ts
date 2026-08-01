import { Injectable } from '@nestjs/common';
import {
  CreativeProjectBrief,
  WorldProfile,
} from '../creative-intelligence.types';

@Injectable()
export class WorldBuildingIntelligenceService {
  build(brief: CreativeProjectBrief): WorldProfile {
    const future = `${brief.concept} ${brief.genre ?? ''}`.toLowerCase().includes('future');

    return {
      name: `${brief.title} World`,
      rules: [
        'fixed geography and scale',
        'fixed environmental logic',
        'technology follows explicit rules',
        'social behavior follows world context',
        'cause and effect remain visible',
      ],
      locations: [
        {
          name: 'Primary World',
          purpose: 'Main narrative environment',
          geography: future ? 'advanced urban and natural systems' : 'story-specific grounded geography',
          architecture: future ? 'future-functional architecture' : 'coherent regional architecture',
          atmosphere: brief.tone ?? 'cinematic',
        },
        {
          name: 'Conflict Zone',
          purpose: 'Environment where pressure increases',
          geography: 'spatially distinct from the primary world',
          architecture: 'visual contrast with the primary world',
          atmosphere: 'tense and controlled',
        },
        {
          name: 'Resolution Space',
          purpose: 'Environment that visually communicates transformation',
          geography: 'open, readable and symbolically meaningful',
          architecture: 'evolved version of established world language',
          atmosphere: 'clear and emotionally satisfying',
        },
      ],
      colorLanguage: [
        'primary-world-color-family',
        'conflict-color-family',
        'resolution-color-family',
      ],
      environmentalContinuity: [
        'time-of-day continuity',
        'weather continuity',
        'prop-state continuity',
        'damage-state continuity',
        'crowd-density continuity',
      ],
    };
  }
}