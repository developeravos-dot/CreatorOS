import { Test } from '@nestjs/testing';
import { CommunityIntelligenceStageController } from './community-intelligence-stage.controller';
import { CommunityIntelligenceStageService } from './community-intelligence-stage.service';

describe('CommunityIntelligenceStageController', () => {
  let controller: CommunityIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommunityIntelligenceStageController],
      providers: [CommunityIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(CommunityIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
