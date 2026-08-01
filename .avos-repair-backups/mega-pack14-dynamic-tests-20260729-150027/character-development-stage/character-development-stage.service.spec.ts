import { Test } from '@nestjs/testing';
import { CharacterDevelopmentStageService } from './character-development-stage.service';

describe('CharacterDevelopmentStageService', () => {
  let service: CharacterDevelopmentStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CharacterDevelopmentStageService],
    }).compile();

    service = moduleRef.get(CharacterDevelopmentStageService);
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
