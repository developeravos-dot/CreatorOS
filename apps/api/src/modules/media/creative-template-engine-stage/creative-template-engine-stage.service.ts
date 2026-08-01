import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class CreativeTemplateEngineStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Creative Template Engine', 'creative-template-engine');
  }
}
