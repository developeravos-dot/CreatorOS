import { Module } from '@nestjs/common';

import {
  ProtectionStrategyStageController,
} from './protection-strategy-stage.controller';

import {
  ProtectionStrategyStageService,
} from './protection-strategy-stage.service';

@Module({
  controllers: [
    ProtectionStrategyStageController,
  ],
  providers: [
    ProtectionStrategyStageService,
  ],
  exports: [
    ProtectionStrategyStageService,
  ],
})
export class ProtectionStrategyStageModule {}
