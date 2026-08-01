import { Test } from '@nestjs/testing';
import { CrossPromotionStageService } from './cross-promotion-stage.service';

describe('CrossPromotionStageService', () => {
  let service: CrossPromotionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CrossPromotionStageService],
    }).compile();

    service = moduleRef.get(CrossPromotionStageService);
  });

  it('should be operational', () => {
    expect(service.getDashboard().status).toBe('operational');
    const dashboard = service.getDashboard();
    const blueprint = service.getBlueprint();

    expect(dashboard.totalStages).toBe(blueprint.stages.length);
    expect(dashboard.totalStages).toBeGreaterThan(0);
  });

  it('should create project', () => {
    const project = service.createProject({
      name: 'AVOS Ultra Media Project',
      owner: 'AVOS',
    });

    const blueprint = service.getBlueprint();

    expect(project.stages).toHaveLength(blueprint.stages.length);
    expect(project.stages.length).toBeGreaterThan(0);
  });
});

