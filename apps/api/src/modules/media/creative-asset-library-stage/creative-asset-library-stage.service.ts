import { Injectable } from '@nestjs/common';
import { CreativeMediaEcosystemEngineBase } from '../creative-media-ecosystem-core/creative-media-ecosystem-engine.base';

@Injectable()
export class CreativeAssetLibraryStageService extends CreativeMediaEcosystemEngineBase {
  constructor() {
    super('AVOS Creative Asset Library', 'creative-asset-library');
  }
}
