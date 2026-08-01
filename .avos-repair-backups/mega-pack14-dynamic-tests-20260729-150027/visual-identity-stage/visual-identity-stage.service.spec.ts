import { Test } from '@nestjs/testing';
import { VisualIdentityStageService } from './visual-identity-stage.service';

describe('VisualIdentityStageService', () => {
  let service: VisualIdentityStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [VisualIdentityStageService],
    }).compile();

    service = moduleRef.get(VisualIdentityStageService);
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
