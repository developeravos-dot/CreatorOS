import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  AbTestingEngineController,
} from './ab-testing-engine.controller';

import {
  AbTestingEngineService,
} from './ab-testing-engine.service';

describe('AbTestingEngineController', () => {
  let controller: AbTestingEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AbTestingEngineController],
        providers: [AbTestingEngineService],
      }).compile();

    controller =
      module.get<AbTestingEngineController>(
        AbTestingEngineController,
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

  it('should create a record', () => {
    const record = controller.createRecord({
      title: 'Controller Record',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
