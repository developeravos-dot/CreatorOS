import { Test } from '@nestjs/testing';
import { LogoIntelligenceStageService } from './logo-intelligence-stage.service';

describe('LogoIntelligenceStageService', () => {
  let service: LogoIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LogoIntelligenceStageService],
    }).compile();

    service = moduleRef.get(LogoIntelligenceStageService);
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
