import { Test } from '@nestjs/testing';
import { RetentionIntelligenceStageService } from './retention-intelligence-stage.service';

describe('RetentionIntelligenceStageService', () => {
  let service: RetentionIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RetentionIntelligenceStageService],
    }).compile();

    service = moduleRef.get(RetentionIntelligenceStageService);
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
