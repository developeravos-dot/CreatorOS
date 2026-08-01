import { Module } from '@nestjs/common';

import {
  VideoProductionController,
} from './video-production.controller';

import {
  VideoProductionService,
} from './video-production.service';

@Module({
  controllers: [VideoProductionController],
  providers: [VideoProductionService],
  exports: [VideoProductionService],
})
export class VideoProductionModule {}
