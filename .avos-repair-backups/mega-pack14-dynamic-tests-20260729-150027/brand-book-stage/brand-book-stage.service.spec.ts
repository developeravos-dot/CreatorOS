import { Test } from '@nestjs/testing';
import { BrandBookStageService } from './brand-book-stage.service';

describe('BrandBookStageService', () => {
  let service: BrandBookStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BrandBookStageService],
    }).compile();

    service = moduleRef.get(BrandBookStageService);
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
