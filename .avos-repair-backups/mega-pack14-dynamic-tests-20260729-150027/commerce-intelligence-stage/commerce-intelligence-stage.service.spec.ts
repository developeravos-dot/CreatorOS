import { Test } from '@nestjs/testing';
import { CommerceIntelligenceStageService } from './commerce-intelligence-stage.service';

describe('CommerceIntelligenceStageService', () => {
  let service: CommerceIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CommerceIntelligenceStageService],
    }).compile();

    service = moduleRef.get(CommerceIntelligenceStageService);
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
