import { Test } from '@nestjs/testing';
import { AudiencePredictionStageService } from './audience-prediction-stage.service';

describe('AudiencePredictionStageService', () => {
  let service: AudiencePredictionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AudiencePredictionStageService],
    }).compile();

    service = moduleRef.get(AudiencePredictionStageService);
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
