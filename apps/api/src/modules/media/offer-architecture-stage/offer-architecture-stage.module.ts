import { Module } from '@nestjs/common';
import { OfferArchitectureStageController } from './offer-architecture-stage.controller';
import { OfferArchitectureStageService } from './offer-architecture-stage.service';

@Module({
  controllers: [OfferArchitectureStageController],
  providers: [OfferArchitectureStageService],
  exports: [OfferArchitectureStageService],
})
export class OfferArchitectureStageModule {}
