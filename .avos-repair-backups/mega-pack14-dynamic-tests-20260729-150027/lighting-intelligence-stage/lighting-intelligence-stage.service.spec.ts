import { Test } from '@nestjs/testing';
import { LightingIntelligenceStageService } from './lighting-intelligence-stage.service';

describe('LightingIntelligenceStageService', () => {
  let service: LightingIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LightingIntelligenceStageService],
    }).compile();

    service = moduleRef.get(LightingIntelligenceStageService);
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
