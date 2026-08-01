import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ReportingEngineController,
} from './reporting-engine.controller';

import {
  ReportingEngineService,
} from './reporting-engine.service';

describe('ReportingEngineController', () => {
  let controller: ReportingEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ReportingEngineController],
        providers: [ReportingEngineService],
      }).compile();

    controller =
      module.get<ReportingEngineController>(
        ReportingEngineController,
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
