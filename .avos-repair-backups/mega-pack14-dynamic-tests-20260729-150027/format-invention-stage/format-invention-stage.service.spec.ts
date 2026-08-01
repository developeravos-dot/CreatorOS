import { Test } from '@nestjs/testing';
import { FormatInventionStageService } from './format-invention-stage.service';

describe('FormatInventionStageService', () => {
  let service: FormatInventionStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FormatInventionStageService],
    }).compile();

    service = moduleRef.get(FormatInventionStageService);
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
