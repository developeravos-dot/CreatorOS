import { Module } from '@nestjs/common';

import {
  CreativeAiCouncilController,
} from './creative-ai-council.controller';

import {
  CreativeAiCouncilService,
} from './creative-ai-council.service';

@Module({
  controllers: [CreativeAiCouncilController],
  providers: [CreativeAiCouncilService],
  exports: [CreativeAiCouncilService],
})
export class CreativeAiCouncilModule {}
