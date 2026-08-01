import { Module } from '@nestjs/common';

import {
  ContentConceptLabController,
} from './content-concept-lab.controller';

import {
  ContentConceptLabService,
} from './content-concept-lab.service';

@Module({
  controllers: [ContentConceptLabController],
  providers: [ContentConceptLabService],
  exports: [ContentConceptLabService],
})
export class ContentConceptLabModule {}
