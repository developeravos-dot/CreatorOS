import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  SponsorshipManagerController,
} from './sponsorship-manager.controller';

import {
  SponsorshipManagerService,
} from './sponsorship-manager.service';

describe('SponsorshipManagerController', () => {
  let controller: SponsorshipManagerController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [SponsorshipManagerController],
        providers: [SponsorshipManagerService],
      }).compile();

    controller =
      module.get<SponsorshipManagerController>(
        SponsorshipManagerController,
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

  it('should create a monetization record', () => {
    const record = controller.createRecord({
      title: 'Controller Revenue',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
