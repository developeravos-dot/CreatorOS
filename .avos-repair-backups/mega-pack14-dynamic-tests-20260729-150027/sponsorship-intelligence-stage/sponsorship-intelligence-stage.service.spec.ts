import { Test } from '@nestjs/testing';
import { SponsorshipIntelligenceStageService } from './sponsorship-intelligence-stage.service';

describe('SponsorshipIntelligenceStageService', () => {
  let service: SponsorshipIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SponsorshipIntelligenceStageService],
    }).compile();

    service = moduleRef.get(SponsorshipIntelligenceStageService);
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
