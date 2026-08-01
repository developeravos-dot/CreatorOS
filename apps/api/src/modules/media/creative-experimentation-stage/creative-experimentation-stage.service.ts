import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class CreativeExperimentationStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Creative Experimentation', 'creative-experimentation');
  }
}
