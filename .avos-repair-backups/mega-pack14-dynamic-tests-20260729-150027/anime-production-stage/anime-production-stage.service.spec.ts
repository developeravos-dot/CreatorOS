import { Test } from '@nestjs/testing';
import { AnimeProductionStageService } from './anime-production-stage.service';

describe('AnimeProductionStageService', () => {
  let service: AnimeProductionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AnimeProductionStageService],
    }).compile();

    service = moduleRef.get(AnimeProductionStageService);
  });

  it('should be operational', () => {
    expect(service.getDashboard().status).toBe('operational');
    expect(service.getDashboard().totalStages).toBe(60);
  });

  it('should create project', () => {
    const project = service.createProject({
      name: 'AVOS Ultra Media Project',
      owner: 'AVOS',
    });

    expect(project.stages).toHaveLength(60);
  });
});
