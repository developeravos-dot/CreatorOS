import { Test } from '@nestjs/testing';
import { SoundDesignStageService } from './sound-design-stage.service';

describe('SoundDesignStageService', () => {
  let service: SoundDesignStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SoundDesignStageService],
    }).compile();

    service = moduleRef.get(SoundDesignStageService);
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
