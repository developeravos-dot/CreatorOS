import { Test } from '@nestjs/testing';
import { CommerceIntelligenceStageController } from './commerce-intelligence-stage.controller';
import { CommerceIntelligenceStageService } from './commerce-intelligence-stage.service';

describe('CommerceIntelligenceStageController', () => {
  let controller: CommerceIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommerceIntelligenceStageController],
      providers: [CommerceIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(CommerceIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
