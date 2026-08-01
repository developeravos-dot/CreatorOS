import { Test } from '@nestjs/testing';
import { SponsorshipIntelligenceStageController } from './sponsorship-intelligence-stage.controller';
import { SponsorshipIntelligenceStageService } from './sponsorship-intelligence-stage.service';

describe('SponsorshipIntelligenceStageController', () => {
  let controller: SponsorshipIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SponsorshipIntelligenceStageController],
      providers: [SponsorshipIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(SponsorshipIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
