import { Module } from '@nestjs/common';
import { EditingIntelligenceStageController } from './editing-intelligence-stage.controller';
import { EditingIntelligenceStageService } from './editing-intelligence-stage.service';

@Module({
  controllers: [EditingIntelligenceStageController],
  providers: [EditingIntelligenceStageService],
  exports: [EditingIntelligenceStageService],
})
export class EditingIntelligenceStageModule {}
