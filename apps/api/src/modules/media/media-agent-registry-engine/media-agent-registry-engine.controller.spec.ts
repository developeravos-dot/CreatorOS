import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaAgentRegistryEngineController,
} from './media-agent-registry-engine.controller';

import {
  MediaAgentRegistryEngineService,
} from './media-agent-registry-engine.service';

describe('MediaAgentRegistryEngineController', () => {
  let controller: MediaAgentRegistryEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MediaAgentRegistryEngineController,
        ],
        providers: [
          MediaAgentRegistryEngineService,
        ],
      }).compile();

    controller =
      module.get<MediaAgentRegistryEngineController>(
        MediaAgentRegistryEngineController,
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
