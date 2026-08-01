import { Test } from '@nestjs/testing';
import { EcosystemOrchestrationStageService } from './ecosystem-orchestration-stage.service';

describe('EcosystemOrchestrationStageService', () => {
  let service: EcosystemOrchestrationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [EcosystemOrchestrationStageService],
    }).compile();

    service = moduleRef.get(EcosystemOrchestrationStageService);
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
