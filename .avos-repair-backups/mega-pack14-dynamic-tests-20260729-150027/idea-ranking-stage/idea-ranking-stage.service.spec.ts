import { Test } from '@nestjs/testing';
import { IdeaRankingStageService } from './idea-ranking-stage.service';

describe('IdeaRankingStageService', () => {
  let service: IdeaRankingStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [IdeaRankingStageService],
    }).compile();

    service = moduleRef.get(IdeaRankingStageService);
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
