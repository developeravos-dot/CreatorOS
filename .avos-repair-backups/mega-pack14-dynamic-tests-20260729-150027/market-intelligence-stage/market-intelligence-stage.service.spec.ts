import { Test } from '@nestjs/testing';
import { MarketIntelligenceStageService } from './market-intelligence-stage.service';

describe('MarketIntelligenceStageService', () => {
  let service: MarketIntelligenceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MarketIntelligenceStageService],
    }).compile();

    service = moduleRef.get(MarketIntelligenceStageService);
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
