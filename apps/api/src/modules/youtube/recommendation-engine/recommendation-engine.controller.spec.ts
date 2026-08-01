import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  RecommendationEngineController,
} from './recommendation-engine.controller';

import {
  RecommendationEngineService,
} from './recommendation-engine.service';

describe('RecommendationEngineController', () => {
  let controller: RecommendationEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [RecommendationEngineController],
        providers: [RecommendationEngineService],
      }).compile();

    controller =
      module.get<RecommendationEngineController>(
        RecommendationEngineController,
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
      title: 'Controller Operation',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
