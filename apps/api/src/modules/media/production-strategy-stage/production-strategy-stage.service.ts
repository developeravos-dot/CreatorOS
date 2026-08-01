import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class ProductionStrategyStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Production Strategy', 'production-strategy');
  }
}
