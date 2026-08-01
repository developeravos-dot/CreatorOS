import { Test } from '@nestjs/testing';
import { MusicIntelligenceStageService } from './music-intelligence-stage.service';

describe('MusicIntelligenceStageService', () => {
  let service: MusicIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MusicIntelligenceStageService],
    }).compile();

    service = moduleRef.get(MusicIntelligenceStageService);
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
