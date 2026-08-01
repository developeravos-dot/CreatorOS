import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../modules/persistence';

import { MediaResearchController } from './media-research.controller';
import { MediaResearchRepository } from './media-research.repository';
import { MediaResearchService } from './media-research.service';

@Module({
  imports: [
    PersistenceModule,
  ],
  controllers: [
    MediaResearchController,
  ],
  providers: [
    MediaResearchRepository,
    MediaResearchService,
  ],
  exports: [
    MediaResearchService,
  ],
})
export class MediaResearchModule {
  constructor() {
    console.log('### MEDIA RESEARCH MODULE LOADED ###');
  }
}

