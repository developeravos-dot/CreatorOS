import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  SchedulingEngineController,
} from './scheduling-engine.controller';

import {
  SchedulingEngineService,
} from './scheduling-engine.service';

describe('SchedulingEngineController', () => {
  let controller: SchedulingEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [SchedulingEngineController],
        providers: [SchedulingEngineService],
      }).compile();

    controller =
      module.get<SchedulingEngineController>(
        SchedulingEngineController,
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
      title: 'Controller Operation',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
