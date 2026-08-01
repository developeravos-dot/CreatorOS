import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioCapitalAllocationStageController } from './portfolio-capital-allocation-stage.controller';
import { PortfolioCapitalAllocationStageService } from './portfolio-capital-allocation-stage.service';

describe('PortfolioCapitalAllocationStageController', () => {
  let controller: PortfolioCapitalAllocationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PortfolioCapitalAllocationStageController], providers: [PortfolioCapitalAllocationStageService] }).compile();
    controller = module.get<PortfolioCapitalAllocationStageController>(PortfolioCapitalAllocationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
