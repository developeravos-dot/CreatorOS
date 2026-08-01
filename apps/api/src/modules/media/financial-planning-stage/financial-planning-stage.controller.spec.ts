import { Test, TestingModule } from '@nestjs/testing';
import { FinancialPlanningStageController } from './financial-planning-stage.controller';
import { FinancialPlanningStageService } from './financial-planning-stage.service';

describe('FinancialPlanningStageController', () => {
  let controller: FinancialPlanningStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [FinancialPlanningStageController], providers: [FinancialPlanningStageService] }).compile();
    controller = module.get<FinancialPlanningStageController>(FinancialPlanningStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
