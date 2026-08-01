import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaIpRegistryEngineController,
} from './media-ip-registry-engine.controller';

import {
  MediaIpRegistryEngineService,
} from './media-ip-registry-engine.service';

describe('MediaIpRegistryEngineController', () => {
  let controller: MediaIpRegistryEngineController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MediaIpRegistryEngineController,
        ],
        providers: [
          MediaIpRegistryEngineService,
        ],
      }).compile();

    controller =
      module.get<MediaIpRegistryEngineController>(
        MediaIpRegistryEngineController,
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
