import { Test } from '@nestjs/testing';
import { CinematographyIntelligenceStageService } from './cinematography-intelligence-stage.service';

describe('CinematographyIntelligenceStageService', () => {
  let service: CinematographyIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CinematographyIntelligenceStageService],
    }).compile();

    service = moduleRef.get(CinematographyIntelligenceStageService);
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
