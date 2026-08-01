import { Module } from '@nestjs/common';
import { CreativeQualityAssuranceStageController } from './creative-quality-assurance-stage.controller';
import { CreativeQualityAssuranceStageService } from './creative-quality-assurance-stage.service';

@Module({
  controllers: [CreativeQualityAssuranceStageController],
  providers: [CreativeQualityAssuranceStageService],
  exports: [CreativeQualityAssuranceStageService],
})
export class CreativeQualityAssuranceStageModule {}
