import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  VideoProductionController,
} from './video-production.controller';

import {
  VideoProductionService,
} from './video-production.service';

describe('VideoProductionController', () => {
  let controller: VideoProductionController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [VideoProductionController],
        providers: [VideoProductionService],
      }).compile();

    controller =
      module.get<VideoProductionController>(
        VideoProductionController,
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

  it('should create a production record', () => {
    const record = controller.createRecord({
      title: 'Controller Asset',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
