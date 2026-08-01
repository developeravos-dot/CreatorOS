import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  PublishingAutomationController,
} from './publishing-automation.controller';

import {
  PublishingAutomationService,
} from './publishing-automation.service';

describe('PublishingAutomationController', () => {
  let controller: PublishingAutomationController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PublishingAutomationController],
        providers: [PublishingAutomationService],
      }).compile();

    controller =
      module.get<PublishingAutomationController>(
        PublishingAutomationController,
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
