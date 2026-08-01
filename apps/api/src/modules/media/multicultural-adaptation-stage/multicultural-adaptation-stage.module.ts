import { Module } from '@nestjs/common';
import { MulticulturalAdaptationStageController } from './multicultural-adaptation-stage.controller';
import { MulticulturalAdaptationStageService } from './multicultural-adaptation-stage.service';

@Module({
  controllers: [MulticulturalAdaptationStageController],
  providers: [MulticulturalAdaptationStageService],
  exports: [MulticulturalAdaptationStageService],
})
export class MulticulturalAdaptationStageModule {}
