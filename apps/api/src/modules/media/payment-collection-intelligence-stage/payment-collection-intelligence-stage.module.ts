import { Module } from '@nestjs/common';
import { PaymentCollectionIntelligenceStageController } from './payment-collection-intelligence-stage.controller';
import { PaymentCollectionIntelligenceStageService } from './payment-collection-intelligence-stage.service';

@Module({
  controllers: [PaymentCollectionIntelligenceStageController],
  providers: [PaymentCollectionIntelligenceStageService],
  exports: [PaymentCollectionIntelligenceStageService],
})
export class PaymentCollectionIntelligenceStageModule {}
