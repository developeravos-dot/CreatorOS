import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentCreationStageController,
} from './content-creation-stage.controller';

import {
  ContentCreationStageService,
} from './content-creation-stage.service';

describe('ContentCreationStageController', () => {
  let controller: ContentCreationStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ContentCreationStageController,
        ],
        providers: [
          ContentCreationStageService,
        ],
      }).compile();

    controller =
      module.get<ContentCreationStageController>(
        ContentCreationStageController,
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
