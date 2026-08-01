import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class AudienceSharingIntelligenceStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Audience Sharing Intelligence', 'audience-sharing-intelligence');
  }
}
