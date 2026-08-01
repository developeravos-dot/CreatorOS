import { Test } from '@nestjs/testing';
import { RevenueAttributionStageService } from './revenue-attribution-stage.service';

describe('RevenueAttributionStageService', () => {
  let service: RevenueAttributionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RevenueAttributionStageService],
    }).compile();

    service = moduleRef.get(RevenueAttributionStageService);
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
