import { Test, TestingModule } from '@nestjs/testing';
import { PaymentCollectionIntelligenceStageController } from './payment-collection-intelligence-stage.controller';
import { PaymentCollectionIntelligenceStageService } from './payment-collection-intelligence-stage.service';

describe('PaymentCollectionIntelligenceStageController', () => {
  let controller: PaymentCollectionIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PaymentCollectionIntelligenceStageController], providers: [PaymentCollectionIntelligenceStageService] }).compile();
    controller = module.get<PaymentCollectionIntelligenceStageController>(PaymentCollectionIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
