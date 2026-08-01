import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionMembershipIntelligenceStageController } from './subscription-membership-intelligence-stage.controller';
import { SubscriptionMembershipIntelligenceStageService } from './subscription-membership-intelligence-stage.service';

describe('SubscriptionMembershipIntelligenceStageController', () => {
  let controller: SubscriptionMembershipIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [SubscriptionMembershipIntelligenceStageController], providers: [SubscriptionMembershipIntelligenceStageService] }).compile();
    controller = module.get<SubscriptionMembershipIntelligenceStageController>(SubscriptionMembershipIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
