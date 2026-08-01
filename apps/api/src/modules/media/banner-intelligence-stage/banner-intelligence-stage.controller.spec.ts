import { Test, TestingModule } from '@nestjs/testing';
import { BannerIntelligenceStageController } from './banner-intelligence-stage.controller';
import { BannerIntelligenceStageService } from './banner-intelligence-stage.service';

describe('BannerIntelligenceStageController', () => {
  let controller: BannerIntelligenceStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BannerIntelligenceStageController], providers: [BannerIntelligenceStageService] }).compile();
    controller = module.get(BannerIntelligenceStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
