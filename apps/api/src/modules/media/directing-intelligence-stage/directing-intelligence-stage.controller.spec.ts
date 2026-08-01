import { Test } from '@nestjs/testing';
import { DirectingIntelligenceStageController } from './directing-intelligence-stage.controller';
import { DirectingIntelligenceStageService } from './directing-intelligence-stage.service';

describe('DirectingIntelligenceStageController', () => {
  let controller: DirectingIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DirectingIntelligenceStageController],
      providers: [DirectingIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(DirectingIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
