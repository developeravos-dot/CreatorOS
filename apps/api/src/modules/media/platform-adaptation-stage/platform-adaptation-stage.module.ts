import { Module } from '@nestjs/common';
import { PlatformAdaptationStageController } from './platform-adaptation-stage.controller';
import { PlatformAdaptationStageService } from './platform-adaptation-stage.service';

@Module({
  controllers: [PlatformAdaptationStageController],
  providers: [PlatformAdaptationStageService],
  exports: [PlatformAdaptationStageService],
})
export class PlatformAdaptationStageModule {}
