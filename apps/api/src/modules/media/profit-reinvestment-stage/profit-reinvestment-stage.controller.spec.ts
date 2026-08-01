import { Test, TestingModule } from '@nestjs/testing';
import { ProfitReinvestmentStageController } from './profit-reinvestment-stage.controller';
import { ProfitReinvestmentStageService } from './profit-reinvestment-stage.service';

describe('ProfitReinvestmentStageController', () => {
  let controller: ProfitReinvestmentStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ProfitReinvestmentStageController], providers: [ProfitReinvestmentStageService] }).compile();
    controller = module.get<ProfitReinvestmentStageController>(ProfitReinvestmentStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
