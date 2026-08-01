import { Test, TestingModule } from '@nestjs/testing';
import { BudgetAllocationStageController } from './budget-allocation-stage.controller';
import { BudgetAllocationStageService } from './budget-allocation-stage.service';

describe('BudgetAllocationStageController', () => {
  let controller: BudgetAllocationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BudgetAllocationStageController], providers: [BudgetAllocationStageService] }).compile();
    controller = module.get<BudgetAllocationStageController>(BudgetAllocationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
