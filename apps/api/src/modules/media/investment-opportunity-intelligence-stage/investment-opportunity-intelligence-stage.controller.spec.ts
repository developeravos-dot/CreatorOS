import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentOpportunityIntelligenceStageController } from './investment-opportunity-intelligence-stage.controller';
import { InvestmentOpportunityIntelligenceStageService } from './investment-opportunity-intelligence-stage.service';

describe('InvestmentOpportunityIntelligenceStageController', () => {
  let controller: InvestmentOpportunityIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [InvestmentOpportunityIntelligenceStageController], providers: [InvestmentOpportunityIntelligenceStageService] }).compile();
    controller = module.get<InvestmentOpportunityIntelligenceStageController>(InvestmentOpportunityIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
