import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class AudienceIntelligenceStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Audience Intelligence', 'audience-intelligence');
  }
}
