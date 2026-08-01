import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  OpportunityRadarController,
} from './opportunity-radar.controller';

import {
  OpportunityRadarService,
} from './opportunity-radar.service';

describe('OpportunityRadarController', () => {
  let controller: OpportunityRadarController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [OpportunityRadarController],
        providers: [OpportunityRadarService],
      }).compile();

    controller =
      module.get<OpportunityRadarController>(
        OpportunityRadarController,
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
