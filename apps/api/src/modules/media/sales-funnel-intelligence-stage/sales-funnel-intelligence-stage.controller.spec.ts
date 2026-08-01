import { Test, TestingModule } from '@nestjs/testing';
import { SalesFunnelIntelligenceStageController } from './sales-funnel-intelligence-stage.controller';
import { SalesFunnelIntelligenceStageService } from './sales-funnel-intelligence-stage.service';

describe('SalesFunnelIntelligenceStageController', () => {
  let controller: SalesFunnelIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [SalesFunnelIntelligenceStageController], providers: [SalesFunnelIntelligenceStageService] }).compile();
    controller = module.get<SalesFunnelIntelligenceStageController>(SalesFunnelIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
