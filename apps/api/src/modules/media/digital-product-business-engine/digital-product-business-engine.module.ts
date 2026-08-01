import { Module } from '@nestjs/common';

import {
  DigitalProductBusinessEngineController,
} from './digital-product-business-engine.controller';

import {
  DigitalProductBusinessEngineService,
} from './digital-product-business-engine.service';

@Module({
  controllers: [DigitalProductBusinessEngineController],
  providers: [DigitalProductBusinessEngineService],
  exports: [DigitalProductBusinessEngineService],
})
export class DigitalProductBusinessEngineModule {}
