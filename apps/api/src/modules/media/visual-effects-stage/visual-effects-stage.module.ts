import { Module } from '@nestjs/common';
import { VisualEffectsStageController } from './visual-effects-stage.controller';
import { VisualEffectsStageService } from './visual-effects-stage.service';

@Module({
  controllers: [VisualEffectsStageController],
  providers: [VisualEffectsStageService],
  exports: [VisualEffectsStageService],
})
export class VisualEffectsStageModule {}
