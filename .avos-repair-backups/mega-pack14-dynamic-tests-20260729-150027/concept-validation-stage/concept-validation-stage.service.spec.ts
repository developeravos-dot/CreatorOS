import { Test } from '@nestjs/testing';
import { ConceptValidationStageService } from './concept-validation-stage.service';

describe('ConceptValidationStageService', () => {
  let service: ConceptValidationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConceptValidationStageService],
    }).compile();

    service = moduleRef.get(ConceptValidationStageService);
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
