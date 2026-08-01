import { Test } from '@nestjs/testing';
import { IdeaRankingStageController } from './idea-ranking-stage.controller';
import { IdeaRankingStageService } from './idea-ranking-stage.service';

describe('IdeaRankingStageController', () => {
  let controller: IdeaRankingStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IdeaRankingStageController],
      providers: [IdeaRankingStageService],
    }).compile();

    controller = moduleRef.get(IdeaRankingStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
