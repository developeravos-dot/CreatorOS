import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  VoiceProductionController,
} from './voice-production.controller';

import {
  VoiceProductionService,
} from './voice-production.service';

describe('VoiceProductionController', () => {
  let controller: VoiceProductionController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [VoiceProductionController],
        providers: [VoiceProductionService],
      }).compile();

    controller =
      module.get<VoiceProductionController>(
        VoiceProductionController,
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
