import { Module } from '@nestjs/common';
import { FormatInventionStageController } from './format-invention-stage.controller';
import { FormatInventionStageService } from './format-invention-stage.service';

@Module({
  controllers: [FormatInventionStageController],
  providers: [FormatInventionStageService],
  exports: [FormatInventionStageService],
})
export class FormatInventionStageModule {}
