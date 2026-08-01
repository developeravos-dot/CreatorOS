import { Test } from '@nestjs/testing';
import { ContinuityControlStageService } from './continuity-control-stage.service';

describe('ContinuityControlStageService', () => {
  let service: ContinuityControlStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ContinuityControlStageService],
    }).compile();

    service = moduleRef.get(ContinuityControlStageService);
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
