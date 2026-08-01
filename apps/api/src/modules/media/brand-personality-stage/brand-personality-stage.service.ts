import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class BrandPersonalityStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Brand Personality', 'brand-personality');
  }
}
