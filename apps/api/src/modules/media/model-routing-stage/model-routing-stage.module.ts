import { Module } from '@nestjs/common';
import { ModelRoutingStageController } from './model-routing-stage.controller';
import { ModelRoutingStageService } from './model-routing-stage.service';

@Module({
  controllers: [ModelRoutingStageController],
  providers: [ModelRoutingStageService],
  exports: [ModelRoutingStageService],
})
export class ModelRoutingStageModule {}
