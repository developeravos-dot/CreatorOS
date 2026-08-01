import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  OpportunityDiscoveryStageController,
} from './opportunity-discovery-stage.controller';

import {
  OpportunityDiscoveryStageService,
} from './opportunity-discovery-stage.service';

describe('OpportunityDiscoveryStageController', () => {
  let controller: OpportunityDiscoveryStageController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          OpportunityDiscoveryStageController,
        ],
        providers: [
          OpportunityDiscoveryStageService,
        ],
      }).compile();

    controller =
      module.get<OpportunityDiscoveryStageController>(
        OpportunityDiscoveryStageController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
