import { Module } from '@nestjs/common';

import {
  DigitalProductsEngineController,
} from './digital-products-engine.controller';

import {
  DigitalProductsEngineService,
} from './digital-products-engine.service';

@Module({
  controllers: [DigitalProductsEngineController],
  providers: [DigitalProductsEngineService],
  exports: [DigitalProductsEngineService],
})
export class DigitalProductsEngineModule {}
