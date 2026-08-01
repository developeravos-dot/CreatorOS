import { Test } from '@nestjs/testing';
import { BrandNamingStageService } from './brand-naming-stage.service';

describe('BrandNamingStageService', () => {
  let service: BrandNamingStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BrandNamingStageService],
    }).compile();

    service = moduleRef.get(BrandNamingStageService);
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
