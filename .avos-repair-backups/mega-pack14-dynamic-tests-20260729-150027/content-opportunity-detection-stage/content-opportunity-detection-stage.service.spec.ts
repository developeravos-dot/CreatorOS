import { Test } from '@nestjs/testing';
import { ContentOpportunityDetectionStageService } from './content-opportunity-detection-stage.service';

describe('ContentOpportunityDetectionStageService', () => {
  let service: ContentOpportunityDetectionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ContentOpportunityDetectionStageService],
    }).compile();

    service = moduleRef.get(ContentOpportunityDetectionStageService);
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
