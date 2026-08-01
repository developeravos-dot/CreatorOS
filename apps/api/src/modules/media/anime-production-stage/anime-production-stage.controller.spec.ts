import { Test } from '@nestjs/testing';
import { AnimeProductionStageController } from './anime-production-stage.controller';
import { AnimeProductionStageService } from './anime-production-stage.service';

describe('AnimeProductionStageController', () => {
  let controller: AnimeProductionStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AnimeProductionStageController],
      providers: [AnimeProductionStageService],
    }).compile();

    controller = moduleRef.get(AnimeProductionStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
