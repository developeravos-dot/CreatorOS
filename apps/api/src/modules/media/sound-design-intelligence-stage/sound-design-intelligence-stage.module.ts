import { Module } from '@nestjs/common';
import { SoundDesignIntelligenceStageController } from './sound-design-intelligence-stage.controller';
import { SoundDesignIntelligenceStageService } from './sound-design-intelligence-stage.service';

@Module({
  controllers: [SoundDesignIntelligenceStageController],
  providers: [SoundDesignIntelligenceStageService],
  exports: [SoundDesignIntelligenceStageService],
})
export class SoundDesignIntelligenceStageModule {}
