import { Module } from '@nestjs/common';

import {
  IpDigitalDnaStageController,
} from './ip-digital-dna-stage.controller';

import {
  IpDigitalDnaStageService,
} from './ip-digital-dna-stage.service';

@Module({
  controllers: [
    IpDigitalDnaStageController,
  ],
  providers: [
    IpDigitalDnaStageService,
  ],
  exports: [
    IpDigitalDnaStageService,
  ],
})
export class IpDigitalDnaStageModule {}
