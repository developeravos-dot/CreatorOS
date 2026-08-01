import { Test, TestingModule } from '@nestjs/testing';

import { MediaEcosystemService } from './media-ecosystem.service';

describe('MediaEcosystemService', () => {
  let service: MediaEcosystemService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [MediaEcosystemService],
      }).compile();

    service =
      module.get<MediaEcosystemService>(
        MediaEcosystemService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and list an entity', () => {
    const entity = service.createEntity({
      type: 'channel',
      name: 'CreatorOS Channel',
    });

    expect(entity.id).toBeDefined();
    expect(service.listEntities()).toHaveLength(1);
  });

  it('should update an entity', () => {
    const entity = service.createEntity({
      type: 'project',
      name: 'Project One',
    });

    const updated = service.updateEntity(
      entity.id,
      {
        status: 'paused',
      },
    );

    expect(updated.status).toBe('paused');
  });

  it('should remove an entity', () => {
    const entity = service.createEntity({
      type: 'asset',
      name: 'Asset One',
    });

    service.removeEntity(entity.id);

    expect(service.listEntities()).toHaveLength(0);
  });
});
