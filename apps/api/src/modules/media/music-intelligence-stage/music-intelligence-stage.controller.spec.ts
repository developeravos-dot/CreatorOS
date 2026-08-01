import { Test } from '@nestjs/testing';
import { MusicIntelligenceStageController } from './music-intelligence-stage.controller';
import { MusicIntelligenceStageService } from './music-intelligence-stage.service';

describe('MusicIntelligenceStageController', () => {
  let controller: MusicIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MusicIntelligenceStageController],
      providers: [MusicIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(MusicIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
