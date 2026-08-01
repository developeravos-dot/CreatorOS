import { Test } from '@nestjs/testing';
import { EngagementOptimizationStageService } from './engagement-optimization-stage.service';

describe('EngagementOptimizationStageService', () => {
  let service: EngagementOptimizationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [EngagementOptimizationStageService],
    }).compile();

    service = moduleRef.get(EngagementOptimizationStageService);
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
