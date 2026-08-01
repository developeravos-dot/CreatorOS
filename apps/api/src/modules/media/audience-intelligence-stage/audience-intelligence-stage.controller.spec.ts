import { Test, TestingModule } from '@nestjs/testing';
import { AudienceIntelligenceStageController } from './audience-intelligence-stage.controller';
import { AudienceIntelligenceStageService } from './audience-intelligence-stage.service';

describe('AudienceIntelligenceStageController', () => {
  let controller: AudienceIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AudienceIntelligenceStageController], providers: [AudienceIntelligenceStageService] }).compile();
    controller = module.get(AudienceIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
