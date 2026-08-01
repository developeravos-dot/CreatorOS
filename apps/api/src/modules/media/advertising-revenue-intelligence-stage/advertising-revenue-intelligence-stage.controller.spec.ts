import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingRevenueIntelligenceStageController } from './advertising-revenue-intelligence-stage.controller';
import { AdvertisingRevenueIntelligenceStageService } from './advertising-revenue-intelligence-stage.service';

describe('AdvertisingRevenueIntelligenceStageController', () => {
  let controller: AdvertisingRevenueIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AdvertisingRevenueIntelligenceStageController], providers: [AdvertisingRevenueIntelligenceStageService] }).compile();
    controller = module.get<AdvertisingRevenueIntelligenceStageController>(AdvertisingRevenueIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
