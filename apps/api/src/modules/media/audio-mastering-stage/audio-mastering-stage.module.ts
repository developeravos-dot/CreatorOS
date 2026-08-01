import { Module } from '@nestjs/common';
import { AudioMasteringStageController } from './audio-mastering-stage.controller';
import { AudioMasteringStageService } from './audio-mastering-stage.service';

@Module({
  controllers: [AudioMasteringStageController],
  providers: [AudioMasteringStageService],
  exports: [AudioMasteringStageService],
})
export class AudioMasteringStageModule {}
