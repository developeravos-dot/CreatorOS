import { Test } from '@nestjs/testing';
import { LogoIntelligenceStageController } from './logo-intelligence-stage.controller';
import { LogoIntelligenceStageService } from './logo-intelligence-stage.service';

describe('LogoIntelligenceStageController', () => {
  let controller: LogoIntelligenceStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LogoIntelligenceStageController],
      providers: [LogoIntelligenceStageService],
    }).compile();

    controller = moduleRef.get(LogoIntelligenceStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
