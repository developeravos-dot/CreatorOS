import { Test, TestingModule } from '@nestjs/testing';
import { CreativeAnalyticsStageController } from './creative-analytics-stage.controller';
import { CreativeAnalyticsStageService } from './creative-analytics-stage.service';

describe('CreativeAnalyticsStageController', () => {
  let controller: CreativeAnalyticsStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreativeAnalyticsStageController], providers: [CreativeAnalyticsStageService] }).compile();
    controller = module.get(CreativeAnalyticsStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
