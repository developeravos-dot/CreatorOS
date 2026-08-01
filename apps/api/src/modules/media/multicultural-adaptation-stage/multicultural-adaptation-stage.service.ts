import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class MulticulturalAdaptationStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Multicultural Adaptation', 'multicultural-adaptation');
  }
}
