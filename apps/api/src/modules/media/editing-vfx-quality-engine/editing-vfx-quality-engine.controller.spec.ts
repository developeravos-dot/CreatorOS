import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  EditingVfxQualityEngineController,
} from './editing-vfx-quality-engine.controller';

import {
  EditingVfxQualityEngineService,
} from './editing-vfx-quality-engine.service';

describe('EditingVfxQualityEngineController', () => {
  let controller: EditingVfxQualityEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          EditingVfxQualityEngineController,
        ],
        providers: [
          EditingVfxQualityEngineService,
        ],
      }).compile();

    controller =
      module.get<EditingVfxQualityEngineController>(
        EditingVfxQualityEngineController,
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
