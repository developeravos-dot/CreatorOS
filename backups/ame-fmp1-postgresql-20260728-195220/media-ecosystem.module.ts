import { Module } from '@nestjs/common';

import {
  MediaEcosystemController,
} from './media-ecosystem.controller';

import {
  MediaEcosystemService,
} from './media-ecosystem.service';

import {
  MediaEcosystemStore,
} from './media-ecosystem.store';

@Module({
  controllers: [
    MediaEcosystemController,
  ],

  providers: [
    MediaEcosystemService,
    MediaEcosystemStore,
  ],

  exports: [
    MediaEcosystemService,
  ],
})
export class MediaEcosystemModule {}