import { Test, TestingModule } from '@nestjs/testing';
import { MediaEcosystemService } from './media-ecosystem.service';

describe('MediaEcosystemService', () => {
  let service: MediaEcosystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaEcosystemService],
    }).compile();

    service = module.get<MediaEcosystemService>(MediaEcosystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
