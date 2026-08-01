import { Test, TestingModule } from '@nestjs/testing';
import { ContentInvestmentEngineStageController } from './content-investment-engine-stage.controller';
import { ContentInvestmentEngineStageService } from './content-investment-engine-stage.service';

describe('ContentInvestmentEngineStageController', () => {
  let controller: ContentInvestmentEngineStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ContentInvestmentEngineStageController], providers: [ContentInvestmentEngineStageService] }).compile();
    controller = module.get<ContentInvestmentEngineStageController>(ContentInvestmentEngineStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose operational dashboard', () => expect(controller.getDashboard().status).toBe('operational'));
  it('should expose 36 stages', () => expect(controller.getBlueprint().stages).toHaveLength(36));
});
