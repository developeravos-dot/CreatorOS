import { Test } from '@nestjs/testing';
import { PerformanceAnalyticsStageService } from './performance-analytics-stage.service';

describe('PerformanceAnalyticsStageService', () => {
  let service: PerformanceAnalyticsStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PerformanceAnalyticsStageService],
    }).compile();

    service = moduleRef.get(PerformanceAnalyticsStageService);
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
