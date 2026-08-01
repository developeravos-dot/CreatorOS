import { Test } from '@nestjs/testing';
import { PublishingOrchestrationStageService } from './publishing-orchestration-stage.service';

describe('PublishingOrchestrationStageService', () => {
  let service: PublishingOrchestrationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PublishingOrchestrationStageService],
    }).compile();

    service = moduleRef.get(PublishingOrchestrationStageService);
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
