import { Test } from '@nestjs/testing';
import { CampaignCreativeStageService } from './campaign-creative-stage.service';

describe('CampaignCreativeStageService', () => {
  let service: CampaignCreativeStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CampaignCreativeStageService],
    }).compile();

    service = moduleRef.get(CampaignCreativeStageService);
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
