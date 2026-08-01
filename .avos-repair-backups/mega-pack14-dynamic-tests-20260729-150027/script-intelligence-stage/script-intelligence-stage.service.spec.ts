import { Test } from '@nestjs/testing';
import { ScriptIntelligenceStageService } from './script-intelligence-stage.service';

describe('ScriptIntelligenceStageService', () => {
  let service: ScriptIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ScriptIntelligenceStageService],
    }).compile();

    service = moduleRef.get(ScriptIntelligenceStageService);
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
