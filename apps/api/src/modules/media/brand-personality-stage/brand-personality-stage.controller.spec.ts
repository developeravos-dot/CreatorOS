import { Test, TestingModule } from '@nestjs/testing';
import { BrandPersonalityStageController } from './brand-personality-stage.controller';
import { BrandPersonalityStageService } from './brand-personality-stage.service';

describe('BrandPersonalityStageController', () => {
  let controller: BrandPersonalityStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BrandPersonalityStageController], providers: [BrandPersonalityStageService] }).compile();
    controller = module.get(BrandPersonalityStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
