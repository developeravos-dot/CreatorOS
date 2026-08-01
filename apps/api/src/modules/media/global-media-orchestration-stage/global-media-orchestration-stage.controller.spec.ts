import { Test, TestingModule } from '@nestjs/testing';
import { GlobalMediaOrchestrationStageController } from './global-media-orchestration-stage.controller';
import { GlobalMediaOrchestrationStageService } from './global-media-orchestration-stage.service';

describe('GlobalMediaOrchestrationStageController', () => {
  let controller: GlobalMediaOrchestrationStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [GlobalMediaOrchestrationStageController], providers: [GlobalMediaOrchestrationStageService] }).compile();
    controller = module.get(GlobalMediaOrchestrationStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
