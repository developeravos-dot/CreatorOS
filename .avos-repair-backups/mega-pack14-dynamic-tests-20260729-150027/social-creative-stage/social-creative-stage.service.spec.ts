import { Test } from '@nestjs/testing';
import { SocialCreativeStageService } from './social-creative-stage.service';

describe('SocialCreativeStageService', () => {
  let service: SocialCreativeStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SocialCreativeStageService],
    }).compile();

    service = moduleRef.get(SocialCreativeStageService);
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
