import {
  MediaResearchModule,
} from '../media-research/media-research.module';
import { Module } from '@nestjs/common';

import {
  PrismaService,
} from '../../modules/persistence/prisma.service';

import {
  MediaEcosystemController,
} from './media-ecosystem.controller';

import {
  MediaEcosystemRepository,
} from './media-ecosystem.repository';

import {
  MediaEcosystemService,
} from './media-ecosystem.service';

@Module({
  imports: [
    MediaResearchModule,
  ],
  controllers: [
    MediaEcosystemController,
  ],

  providers: [
    PrismaService,
    MediaEcosystemRepository,
    MediaEcosystemService,
  ],

  exports: [
    MediaEcosystemService,
  ],
})
export class MediaEcosystemModule {}

