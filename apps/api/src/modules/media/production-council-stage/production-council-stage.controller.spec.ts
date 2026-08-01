import { Test, TestingModule } from '@nestjs/testing';
import { ProductionCouncilStageController } from './production-council-stage.controller';
import { ProductionCouncilStageService } from './production-council-stage.service';

describe('ProductionCouncilStageController', () => {
  let controller: ProductionCouncilStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ProductionCouncilStageController], providers: [ProductionCouncilStageService] }).compile();
    controller = module.get(ProductionCouncilStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
