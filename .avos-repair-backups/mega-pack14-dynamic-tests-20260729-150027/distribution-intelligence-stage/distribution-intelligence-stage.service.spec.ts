import { Test } from '@nestjs/testing';
import { DistributionIntelligenceStageService } from './distribution-intelligence-stage.service';

describe('DistributionIntelligenceStageService', () => {
  let service: DistributionIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DistributionIntelligenceStageService],
    }).compile();

    service = moduleRef.get(DistributionIntelligenceStageService);
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
