import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CommunityManagerController,
} from './community-manager.controller';

import {
  CommunityManagerService,
} from './community-manager.service';

describe('CommunityManagerController', () => {
  let controller: CommunityManagerController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CommunityManagerController],
        providers: [CommunityManagerService],
      }).compile();

    controller =
      module.get<CommunityManagerController>(
        CommunityManagerController,
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

  it('should create an audience record', () => {
    const record = controller.createRecord({
      name: 'Controller Audience',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
