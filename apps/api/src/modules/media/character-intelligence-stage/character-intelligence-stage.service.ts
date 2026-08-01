import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class CharacterIntelligenceStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Character Intelligence', 'character-intelligence');
  }
}
