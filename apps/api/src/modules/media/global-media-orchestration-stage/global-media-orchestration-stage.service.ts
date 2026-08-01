import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class GlobalMediaOrchestrationStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Global Media Orchestration', 'global-media-orchestration');
  }
}
