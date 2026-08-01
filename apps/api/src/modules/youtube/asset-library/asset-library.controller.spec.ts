import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AssetLibraryController,
} from './asset-library.controller';

import {
  AssetLibraryService,
} from './asset-library.service';

describe('AssetLibraryController', () => {
  let controller: AssetLibraryController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AssetLibraryController],
        providers: [AssetLibraryService],
      }).compile();

    controller =
      module.get<AssetLibraryController>(
        AssetLibraryController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create a production record', () => {
    const record = controller.createRecord({
      title: 'Controller Asset',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
