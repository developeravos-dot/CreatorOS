import { Test } from '@nestjs/testing';
import { RetentionIntelligenceStageController } from './retention-intelligence-stage.controller';
import { RetentionIntelligenceStageService } from './retention-intelligence-stage.service';

describe('RetentionIntelligenceStageController', () => {
  let controller: RetentionIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RetentionIntelligenceStageController],
      providers: [RetentionIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(RetentionIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
