import { Injectable } from '@nestjs/common';
import { MetaIntelligenceInput } from './meta-intelligence.types';

@Injectable()
export class TrendIntelligenceEngineService {
  analyze(input: MetaIntelligenceInput) {
    const urgency = input.urgency ?? 0.6;
    const fit = input.strategicFit ?? 0.75;

    return {
      macro: [
        'AI-native-media-production',
        'owned-IP-economy',
        'global-localization',
        'agentic-enterprise',
        'direct-audience-relationships',
      ],
      micro: [
        `${input.domain}-format-innovation`,
        `${input.domain}-audience-signal`,
        `${input.domain}-platform-shift`,
      ],
      momentumScore: Number(Math.max(0, Math.min(1, urgency * 0.45 + fit * 0.55)).toFixed(3)),
    };
  }
}