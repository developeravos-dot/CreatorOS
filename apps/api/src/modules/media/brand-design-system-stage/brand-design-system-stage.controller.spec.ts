import { Test, TestingModule } from '@nestjs/testing';
import { BrandDesignSystemStageController } from './brand-design-system-stage.controller';
import { BrandDesignSystemStageService } from './brand-design-system-stage.service';

describe('BrandDesignSystemStageController', () => {
  let controller: BrandDesignSystemStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [BrandDesignSystemStageController], providers: [BrandDesignSystemStageService] }).compile();
    controller = module.get(BrandDesignSystemStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
