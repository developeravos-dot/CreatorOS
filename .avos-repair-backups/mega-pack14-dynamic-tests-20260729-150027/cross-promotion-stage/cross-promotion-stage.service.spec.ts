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
