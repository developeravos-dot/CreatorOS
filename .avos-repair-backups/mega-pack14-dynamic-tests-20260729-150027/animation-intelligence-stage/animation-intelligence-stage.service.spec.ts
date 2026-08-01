import { Test } from '@nestjs/testing';
import { AnimationIntelligenceStageService } from './animation-intelligence-stage.service';

describe('AnimationIntelligenceStageService', () => {
  let service: AnimationIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AnimationIntelligenceStageService],
    }).compile();

    service = moduleRef.get(AnimationIntelligenceStageService);
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
