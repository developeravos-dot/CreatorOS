import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ExecutiveDecisionCenterController,
} from './executive-decision-center.controller';

import {
  ExecutiveDecisionCenterService,
} from './executive-decision-center.service';

describe('ExecutiveDecisionCenterController', () => {
  let controller: ExecutiveDecisionCenterController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ExecutiveDecisionCenterController],
        providers: [ExecutiveDecisionCenterService],
      }).compile();

    controller =
      module.get<ExecutiveDecisionCenterController>(
        ExecutiveDecisionCenterController,
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
