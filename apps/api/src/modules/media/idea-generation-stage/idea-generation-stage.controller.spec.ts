import { Test } from '@nestjs/testing';
import { IdeaGenerationStageController } from './idea-generation-stage.controller';
import { IdeaGenerationStageService } from './idea-generation-stage.service';

describe('IdeaGenerationStageController', () => {
  let controller: IdeaGenerationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IdeaGenerationStageController],
      providers: [IdeaGenerationStageService],
    }).compile();

    controller = moduleRef.get(IdeaGenerationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
