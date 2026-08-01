import { Test } from '@nestjs/testing';
import { CreativeAbTestingStageService } from './creative-ab-testing-stage.service';

describe('CreativeAbTestingStageService', () => {
  let service: CreativeAbTestingStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreativeAbTestingStageService],
    }).compile();

    service = moduleRef.get(CreativeAbTestingStageService);
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
