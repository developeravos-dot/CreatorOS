import { Test } from '@nestjs/testing';
import { ColorScienceStageService } from './color-science-stage.service';

describe('ColorScienceStageService', () => {
  let service: ColorScienceStageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ColorScienceStageService],
    }).compile();

    service = moduleRef.get(ColorScienceStageService);
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
