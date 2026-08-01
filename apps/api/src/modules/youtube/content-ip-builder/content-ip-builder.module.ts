import { Module } from '@nestjs/common';

import {
  ContentIpBuilderController,
} from './content-ip-builder.controller';

import {
  ContentIpBuilderService,
} from './content-ip-builder.service';

@Module({
  controllers: [ContentIpBuilderController],
  providers: [ContentIpBuilderService],
  exports: [ContentIpBuilderService],
})
export class ContentIpBuilderModule {}
