import { Module } from '@nestjs/common';
import { SubscriptionMembershipIntelligenceStageController } from './subscription-membership-intelligence-stage.controller';
import { SubscriptionMembershipIntelligenceStageService } from './subscription-membership-intelligence-stage.service';

@Module({
  controllers: [SubscriptionMembershipIntelligenceStageController],
  providers: [SubscriptionMembershipIntelligenceStageService],
  exports: [SubscriptionMembershipIntelligenceStageService],
})
export class SubscriptionMembershipIntelligenceStageModule {}
