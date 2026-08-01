import { Test, TestingModule } from '@nestjs/testing';
import { LicensingRevenueIntelligenceStageController } from './licensing-revenue-intelligence-stage.controller';
import { LicensingRevenueIntelligenceStageService } from './licensing-revenue-intelligence-stage.service';

describe('LicensingRevenueIntelligenceStageController', () => {
  let controller: LicensingRevenueIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [LicensingRevenueIntelligenceStageController], providers: [LicensingRevenueIntelligenceStageService] }).compile();
    controller = module.get<LicensingRevenueIntelligenceStageController>(LicensingRevenueIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
