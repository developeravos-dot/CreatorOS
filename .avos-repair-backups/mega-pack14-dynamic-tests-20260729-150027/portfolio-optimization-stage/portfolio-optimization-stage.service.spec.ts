import { Test } from '@nestjs/testing';
import { PortfolioOptimizationStageService } from './portfolio-optimization-stage.service';

describe('PortfolioOptimizationStageService', () => {
  let service: PortfolioOptimizationStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PortfolioOptimizationStageService],
    }).compile();

    service = moduleRef.get(PortfolioOptimizationStageService);
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
