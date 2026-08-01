import { Test, TestingModule } from '@nestjs/testing';
import { ModelRoutingStageController } from './model-routing-stage.controller';
import { ModelRoutingStageService } from './model-routing-stage.service';

describe('ModelRoutingStageController', () => {
  let controller: ModelRoutingStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [ModelRoutingStageController], providers: [ModelRoutingStageService] }).compile();
    controller = module.get(ModelRoutingStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
