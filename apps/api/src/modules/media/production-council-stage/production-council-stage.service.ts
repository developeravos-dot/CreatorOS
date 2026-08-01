import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class ProductionCouncilStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Production Council', 'production-council');
  }
}
