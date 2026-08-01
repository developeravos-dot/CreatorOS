import { Test, TestingModule } from '@nestjs/testing';

import { MediaEcosystemController } from './media-ecosystem.controller';
import { MediaEcosystemService } from './media-ecosystem.service';

describe('MediaEcosystemController', () => {
  let controller: MediaEcosystemController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [MediaEcosystemController],
        providers: [MediaEcosystemService],
      }).compile();

    controller =
      module.get<MediaEcosystemController>(
        MediaEcosystemController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational status', () => {
    expect(controller.getStatus().status).toBe(
      'operational',
    );
  });
});
