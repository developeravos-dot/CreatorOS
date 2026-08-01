import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CampaignManagerController,
} from './campaign-manager.controller';

import {
  CampaignManagerService,
} from './campaign-manager.service';

describe('CampaignManagerController', () => {
  let controller: CampaignManagerController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CampaignManagerController],
        providers: [CampaignManagerService],
      }).compile();

    controller =
      module.get<CampaignManagerController>(
        CampaignManagerController,
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
