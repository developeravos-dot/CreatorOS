import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  OperationsCommandCenterController,
} from './operations-command-center.controller';

import {
  OperationsCommandCenterService,
} from './operations-command-center.service';

describe('OperationsCommandCenterController', () => {
  let controller: OperationsCommandCenterController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [OperationsCommandCenterController],
        providers: [OperationsCommandCenterService],
      }).compile();

    controller =
      module.get<OperationsCommandCenterController>(
        OperationsCommandCenterController,
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
