import { Test } from '@nestjs/testing';
import { CommunityIntelligenceStageService } from './community-intelligence-stage.service';

describe('CommunityIntelligenceStageService', () => {
  let service: CommunityIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CommunityIntelligenceStageService],
    }).compile();

    service = moduleRef.get(CommunityIntelligenceStageService);
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
