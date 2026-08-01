import { Test } from '@nestjs/testing';
import { HumanFinalAuthorityStageService } from './human-final-authority-stage.service';

describe('HumanFinalAuthorityStageService', () => {
  let service: HumanFinalAuthorityStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HumanFinalAuthorityStageService],
    }).compile();

    service = moduleRef.get(HumanFinalAuthorityStageService);
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
