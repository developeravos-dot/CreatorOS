import { Test } from '@nestjs/testing';
import { VoiceCastingStageService } from './voice-casting-stage.service';

describe('VoiceCastingStageService', () => {
  let service: VoiceCastingStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [VoiceCastingStageService],
    }).compile();

    service = moduleRef.get(VoiceCastingStageService);
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
