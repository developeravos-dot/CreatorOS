import { Test } from '@nestjs/testing';
import { GrowthExperimentationStageService } from './growth-experimentation-stage.service';

describe('GrowthExperimentationStageService', () => {
  let service: GrowthExperimentationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GrowthExperimentationStageService],
    }).compile();

    service = moduleRef.get(GrowthExperimentationStageService);
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
