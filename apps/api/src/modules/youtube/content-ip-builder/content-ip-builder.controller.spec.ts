import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentIpBuilderController,
} from './content-ip-builder.controller';

import {
  ContentIpBuilderService,
} from './content-ip-builder.service';

describe('ContentIpBuilderController', () => {
  let controller: ContentIpBuilderController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ContentIpBuilderController],
        providers: [ContentIpBuilderService],
      }).compile();

    controller =
      module.get<ContentIpBuilderController>(
        ContentIpBuilderController,
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
