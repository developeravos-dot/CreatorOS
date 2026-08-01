import { Module } from '@nestjs/common';
import { BrandPersonalityStageController } from './brand-personality-stage.controller';
import { BrandPersonalityStageService } from './brand-personality-stage.service';

@Module({
  controllers: [BrandPersonalityStageController],
  providers: [BrandPersonalityStageService],
  exports: [BrandPersonalityStageService],
})
export class BrandPersonalityStageModule {}
