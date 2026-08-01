import { Test } from '@nestjs/testing';
import { MultiLanguageAdaptationStageService } from './multi-language-adaptation-stage.service';

describe('MultiLanguageAdaptationStageService', () => {
  let service: MultiLanguageAdaptationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MultiLanguageAdaptationStageService],
    }).compile();

    service = moduleRef.get(MultiLanguageAdaptationStageService);
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
