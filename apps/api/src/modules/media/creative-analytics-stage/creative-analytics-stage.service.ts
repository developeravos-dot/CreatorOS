import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class CreativeAnalyticsStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Creative Analytics', 'creative-analytics');
  }
}
