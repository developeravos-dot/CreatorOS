import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RightsManagementController,
} from './rights-management.controller';

import {
  RightsManagementService,
} from './rights-management.service';

describe('RightsManagementController', () => {
  let controller: RightsManagementController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [RightsManagementController],
        providers: [RightsManagementService],
      }).compile();

    controller =
      module.get<RightsManagementController>(
        RightsManagementController,
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

  it('should create a brand or IP record', () => {
    const record = controller.createRecord({
      name: 'Controller IP',
      category: 'controller',
      owner: 'CreatorOS',
    });

    expect(record.id).toBeDefined();
  });
});
