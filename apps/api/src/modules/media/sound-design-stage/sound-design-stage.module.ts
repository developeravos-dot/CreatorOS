import { Module } from '@nestjs/common';
import { SoundDesignStageController } from './sound-design-stage.controller';
import { SoundDesignStageService } from './sound-design-stage.service';

@Module({
  controllers: [SoundDesignStageController],
  providers: [SoundDesignStageService],
  exports: [SoundDesignStageService],
})
export class SoundDesignStageModule {}
