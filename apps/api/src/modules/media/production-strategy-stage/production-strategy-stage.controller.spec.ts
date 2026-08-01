import { Test, TestingModule } from '@nestjs/testing';
import { ProductionStrategyStageController } from './production-strategy-stage.controller';
import { ProductionStrategyStageService } from './production-strategy-stage.service';

describe('ProductionStrategyStageController', () => {
  let controller: ProductionStrategyStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ProductionStrategyStageController], providers: [ProductionStrategyStageService] }).compile();
    controller = module.get(ProductionStrategyStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
