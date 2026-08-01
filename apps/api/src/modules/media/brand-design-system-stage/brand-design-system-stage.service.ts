import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class BrandDesignSystemStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Brand Design System', 'brand-design-system');
  }
}
