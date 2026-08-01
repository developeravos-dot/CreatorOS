import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  SubscriberGrowthEngineController,
} from './subscriber-growth-engine.controller';

import {
  SubscriberGrowthEngineService,
} from './subscriber-growth-engine.service';

describe('SubscriberGrowthEngineController', () => {
  let controller: SubscriberGrowthEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [SubscriberGrowthEngineController],
        providers: [SubscriberGrowthEngineService],
      }).compile();

    controller =
      module.get<SubscriberGrowthEngineController>(
        SubscriberGrowthEngineController,
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
