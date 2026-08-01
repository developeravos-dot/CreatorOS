import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class MultiplatformAdaptationStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Multiplatform Adaptation', 'multiplatform-adaptation');
  }
}
