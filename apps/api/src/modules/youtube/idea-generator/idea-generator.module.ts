import { Module } from '@nestjs/common';

import {
  IdeaGeneratorController,
} from './idea-generator.controller';

import {
  IdeaGeneratorService,
} from './idea-generator.service';

@Module({
  controllers: [IdeaGeneratorController],
  providers: [IdeaGeneratorService],
  exports: [IdeaGeneratorService],
})
export class IdeaGeneratorModule {}
