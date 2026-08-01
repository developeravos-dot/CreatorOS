import { Test } from '@nestjs/testing';
import { TrendForecastingStageService } from './trend-forecasting-stage.service';

describe('TrendForecastingStageService', () => {
  let service: TrendForecastingStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TrendForecastingStageService],
    }).compile();

    service = moduleRef.get(TrendForecastingStageService);
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
