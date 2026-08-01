import { Module } from '@nestjs/common';

import {
  ContentCreationStageController,
} from './content-creation-stage.controller';

import {
  ContentCreationStageService,
} from './content-creation-stage.service';

@Module({
  controllers: [ContentCreationStageController],
  providers: [ContentCreationStageService],
  exports: [ContentCreationStageService],
})
export class ContentCreationStageModule {}
