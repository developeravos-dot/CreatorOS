import { Injectable } from '@nestjs/common';
import { MediaBusinessRevenueEngineBase } from '../media-business-revenue-core/media-business-revenue-engine.base';

@Injectable()
export class SubscriptionMembershipIntelligenceStageService extends MediaBusinessRevenueEngineBase {
  constructor() {
    super('AVOS Subscription Membership Intelligence', 'subscription-membership-intelligence');
  }
}
