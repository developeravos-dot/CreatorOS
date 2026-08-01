import { Test } from '@nestjs/testing';
import { StoryboardIntelligenceStageService } from './storyboard-intelligence-stage.service';

describe('StoryboardIntelligenceStageService', () => {
  let service: StoryboardIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [StoryboardIntelligenceStageService],
    }).compile();

    service = moduleRef.get(StoryboardIntelligenceStageService);
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
