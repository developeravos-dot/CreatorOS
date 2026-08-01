import { Module } from '@nestjs/common';
import { CreativeTemplateEngineStageController } from './creative-template-engine-stage.controller';
import { CreativeTemplateEngineStageService } from './creative-template-engine-stage.service';

@Module({
  controllers: [CreativeTemplateEngineStageController],
  providers: [CreativeTemplateEngineStageService],
  exports: [CreativeTemplateEngineStageService],
})
export class CreativeTemplateEngineStageModule {}
