import { Test } from '@nestjs/testing';
import { VirtualProductionStageService } from './virtual-production-stage.service';

describe('VirtualProductionStageService', () => {
  let service: VirtualProductionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [VirtualProductionStageService],
    }).compile();

    service = moduleRef.get(VirtualProductionStageService);
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
