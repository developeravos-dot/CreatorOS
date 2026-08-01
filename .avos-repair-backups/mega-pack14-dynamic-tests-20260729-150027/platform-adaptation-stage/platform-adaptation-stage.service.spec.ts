import { Test } from '@nestjs/testing';
import { PlatformAdaptationStageService } from './platform-adaptation-stage.service';

describe('PlatformAdaptationStageService', () => {
  let service: PlatformAdaptationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PlatformAdaptationStageService],
    }).compile();

    service = moduleRef.get(PlatformAdaptationStageService);
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
