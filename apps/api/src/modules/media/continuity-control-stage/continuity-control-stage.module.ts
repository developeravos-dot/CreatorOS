import { Module } from '@nestjs/common';
import { ContinuityControlStageController } from './continuity-control-stage.controller';
import { ContinuityControlStageService } from './continuity-control-stage.service';

@Module({
  controllers: [ContinuityControlStageController],
  providers: [ContinuityControlStageService],
  exports: [ContinuityControlStageService],
})
export class ContinuityControlStageModule {}
