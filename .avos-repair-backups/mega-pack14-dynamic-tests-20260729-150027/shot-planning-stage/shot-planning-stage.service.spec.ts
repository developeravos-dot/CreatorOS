import { Test } from '@nestjs/testing';
import { ShotPlanningStageService } from './shot-planning-stage.service';

describe('ShotPlanningStageService', () => {
  let service: ShotPlanningStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ShotPlanningStageService],
    }).compile();

    service = moduleRef.get(ShotPlanningStageService);
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
