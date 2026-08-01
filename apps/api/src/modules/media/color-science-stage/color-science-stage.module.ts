import { Module } from '@nestjs/common';
import { ColorScienceStageController } from './color-science-stage.controller';
import { ColorScienceStageService } from './color-science-stage.service';

@Module({
  controllers: [ColorScienceStageController],
  providers: [ColorScienceStageService],
  exports: [ColorScienceStageService],
})
export class ColorScienceStageModule {}
