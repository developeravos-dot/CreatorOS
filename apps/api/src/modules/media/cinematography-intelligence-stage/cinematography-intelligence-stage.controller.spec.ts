import { Test } from '@nestjs/testing';
import { CinematographyIntelligenceStageController } from './cinematography-intelligence-stage.controller';
import { CinematographyIntelligenceStageService } from './cinematography-intelligence-stage.service';

describe('CinematographyIntelligenceStageController', () => {
  let controller: CinematographyIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CinematographyIntelligenceStageController],
      providers: [CinematographyIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(CinematographyIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
