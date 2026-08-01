import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  MediaEcosystemController,
} from './media-ecosystem.controller';

import {
  MediaEcosystemService,
} from './media-ecosystem.service';

describe('MediaEcosystemController', () => {
  let controller: MediaEcosystemController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          MediaEcosystemController,
        ],
        providers: [
          MediaEcosystemService,
        ],
      }).compile();

    controller =
      module.get<MediaEcosystemController>(
        MediaEcosystemController,
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
