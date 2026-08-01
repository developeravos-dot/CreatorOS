import { Module } from '@nestjs/common';

import {
  CommerceProductExpansionStageController,
} from './commerce-product-expansion-stage.controller';

import {
  CommerceProductExpansionStageService,
} from './commerce-product-expansion-stage.service';

@Module({
  controllers: [CommerceProductExpansionStageController],
  providers: [CommerceProductExpansionStageService],
  exports: [CommerceProductExpansionStageService],
})
export class CommerceProductExpansionStageModule {}
