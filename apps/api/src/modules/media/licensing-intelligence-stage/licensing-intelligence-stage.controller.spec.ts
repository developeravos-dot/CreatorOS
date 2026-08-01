import { Test } from '@nestjs/testing';
import { LicensingIntelligenceStageController } from './licensing-intelligence-stage.controller';
import { LicensingIntelligenceStageService } from './licensing-intelligence-stage.service';

describe('LicensingIntelligenceStageController', () => {
  let controller: LicensingIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LicensingIntelligenceStageController],
      providers: [LicensingIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(LicensingIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
