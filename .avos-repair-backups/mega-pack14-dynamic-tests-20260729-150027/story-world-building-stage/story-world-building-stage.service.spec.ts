import { Test } from '@nestjs/testing';
import { StoryWorldBuildingStageService } from './story-world-building-stage.service';

describe('StoryWorldBuildingStageService', () => {
  let service: StoryWorldBuildingStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [StoryWorldBuildingStageService],
    }).compile();

    service = moduleRef.get(StoryWorldBuildingStageService);
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
