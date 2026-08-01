import { Test } from '@nestjs/testing';
import { CulturalLocalizationStageService } from './cultural-localization-stage.service';

describe('CulturalLocalizationStageService', () => {
  let service: CulturalLocalizationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CulturalLocalizationStageService],
    }).compile();

    service = moduleRef.get(CulturalLocalizationStageService);
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
