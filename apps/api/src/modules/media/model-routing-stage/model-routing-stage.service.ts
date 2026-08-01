import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class ModelRoutingStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS AI Model Routing', 'model-routing');
  }
}
