import { Test, TestingModule } from '@nestjs/testing';
import { CreativeDirectionStageController } from './creative-direction-stage.controller';
import { CreativeDirectionStageService } from './creative-direction-stage.service';

describe('CreativeDirectionStageController', () => {
  let controller: CreativeDirectionStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreativeDirectionStageController], providers: [CreativeDirectionStageService] }).compile();
    controller = module.get(CreativeDirectionStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
