import { Test } from '@nestjs/testing';
import { VisualEffectsStageService } from './visual-effects-stage.service';

describe('VisualEffectsStageService', () => {
  let service: VisualEffectsStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [VisualEffectsStageService],
    }).compile();

    service = moduleRef.get(VisualEffectsStageService);
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
