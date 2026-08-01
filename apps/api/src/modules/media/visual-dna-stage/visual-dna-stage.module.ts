import { Module } from '@nestjs/common';
import { VisualDnaStageController } from './visual-dna-stage.controller';
import { VisualDnaStageService } from './visual-dna-stage.service';

@Module({
  controllers: [VisualDnaStageController],
  providers: [VisualDnaStageService],
  exports: [VisualDnaStageService],
})
export class VisualDnaStageModule {}
