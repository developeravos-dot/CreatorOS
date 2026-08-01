import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MetadataThumbnailOptimizationController,
} from './metadata-thumbnail-optimization.controller';

import {
  MetadataThumbnailOptimizationService,
} from './metadata-thumbnail-optimization.service';

describe('MetadataThumbnailOptimizationController', () => {
  let controller: MetadataThumbnailOptimizationController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MetadataThumbnailOptimizationController,
        ],
        providers: [
          MetadataThumbnailOptimizationService,
        ],
      }).compile();

    controller =
      module.get<MetadataThumbnailOptimizationController>(
        MetadataThumbnailOptimizationController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
