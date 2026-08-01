import { Test, TestingModule } from '@nestjs/testing';
import { AudienceSharingIntelligenceStageController } from './audience-sharing-intelligence-stage.controller';
import { AudienceSharingIntelligenceStageService } from './audience-sharing-intelligence-stage.service';

describe('AudienceSharingIntelligenceStageController', () => {
  let controller: AudienceSharingIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AudienceSharingIntelligenceStageController], providers: [AudienceSharingIntelligenceStageService] }).compile();
    controller = module.get(AudienceSharingIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
