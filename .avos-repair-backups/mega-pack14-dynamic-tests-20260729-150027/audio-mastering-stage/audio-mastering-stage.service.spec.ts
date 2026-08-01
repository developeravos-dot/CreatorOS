import { Test } from '@nestjs/testing';
import { AudioMasteringStageService } from './audio-mastering-stage.service';

describe('AudioMasteringStageService', () => {
  let service: AudioMasteringStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AudioMasteringStageService],
    }).compile();

    service = moduleRef.get(AudioMasteringStageService);
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
