import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MultilingualContentEngineController,
} from './multilingual-content-engine.controller';

import {
  MultilingualContentEngineService,
} from './multilingual-content-engine.service';

describe('MultilingualContentEngineController', () => {
  let controller: MultilingualContentEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [MultilingualContentEngineController],
        providers: [MultilingualContentEngineService],
      }).compile();

    controller =
      module.get<MultilingualContentEngineController>(
        MultilingualContentEngineController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });
});
