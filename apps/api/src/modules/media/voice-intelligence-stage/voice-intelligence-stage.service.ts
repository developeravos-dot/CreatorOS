import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class VoiceIntelligenceStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Voice Intelligence', 'voice-intelligence');
  }
}
