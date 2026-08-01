import { Test } from '@nestjs/testing';
import { BrandStrategyStageService } from './brand-strategy-stage.service';

describe('BrandStrategyStageService', () => {
  let service: BrandStrategyStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BrandStrategyStageService],
    }).compile();

    service = moduleRef.get(BrandStrategyStageService);
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
