import { Test } from '@nestjs/testing';
import { CreativeQualityAssuranceStageService } from './creative-quality-assurance-stage.service';

describe('CreativeQualityAssuranceStageService', () => {
  let service: CreativeQualityAssuranceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreativeQualityAssuranceStageService],
    }).compile();

    service = moduleRef.get(CreativeQualityAssuranceStageService);
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
