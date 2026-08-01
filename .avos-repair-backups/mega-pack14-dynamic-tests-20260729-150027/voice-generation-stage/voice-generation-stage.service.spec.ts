import { Test } from '@nestjs/testing';
import { VoiceGenerationStageService } from './voice-generation-stage.service';

describe('VoiceGenerationStageService', () => {
  let service: VoiceGenerationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [VoiceGenerationStageService],
    }).compile();

    service = moduleRef.get(VoiceGenerationStageService);
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
