import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseRevenueIntelligenceStageController } from './franchise-revenue-intelligence-stage.controller';
import { FranchiseRevenueIntelligenceStageService } from './franchise-revenue-intelligence-stage.service';

describe('FranchiseRevenueIntelligenceStageController', () => {
  let controller: FranchiseRevenueIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [FranchiseRevenueIntelligenceStageController], providers: [FranchiseRevenueIntelligenceStageService] }).compile();
    controller = module.get<FranchiseRevenueIntelligenceStageController>(FranchiseRevenueIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
