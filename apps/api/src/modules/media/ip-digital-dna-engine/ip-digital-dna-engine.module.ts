import { Module } from '@nestjs/common';

import {
  IpDigitalDnaEngineController,
} from './ip-digital-dna-engine.controller';

import {
  IpDigitalDnaEngineService,
} from './ip-digital-dna-engine.service';

@Module({
  controllers: [IpDigitalDnaEngineController],
  providers: [IpDigitalDnaEngineService],
  exports: [IpDigitalDnaEngineService],
})
export class IpDigitalDnaEngineModule {}
