import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class MultilingualCreativeAdaptationStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Multilingual Creative Adaptation', 'multilingual-creative-adaptation');
  }
}
