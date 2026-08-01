import { Test, TestingModule } from '@nestjs/testing';
import { CreativeAssetLibraryStageController } from './creative-asset-library-stage.controller';
import { CreativeAssetLibraryStageService } from './creative-asset-library-stage.service';

describe('CreativeAssetLibraryStageController', () => {
  let controller: CreativeAssetLibraryStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [CreativeAssetLibraryStageController], providers: [CreativeAssetLibraryStageService] }).compile();
    controller = module.get(CreativeAssetLibraryStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
