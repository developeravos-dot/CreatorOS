import { Test } from '@nestjs/testing';
import { AutonomousLearningStageService } from './autonomous-learning-stage.service';

describe('AutonomousLearningStageService', () => {
  let service: AutonomousLearningStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AutonomousLearningStageService],
    }).compile();

    service = moduleRef.get(AutonomousLearningStageService);
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
