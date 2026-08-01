import { Test, TestingModule } from '@nestjs/testing';
import { SoundDesignStageService } from './sound-design-stage.service';

describe('SoundDesignStageService', () => {
  let service: SoundDesignStageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoundDesignStageService],
    }).compile();

    service = module.get<SoundDesignStageService>(SoundDesignStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be operational with a dynamic blueprint', () => {
    const dashboard = service.getDashboard();
    const blueprint = service.getBlueprint();

    expect(dashboard.status).toBe('operational');
    expect(blueprint.stages.length).toBeGreaterThan(0);
    expect(dashboard.totalStages).toBe(blueprint.stages.length);
  });

  it('should create a project matching the current blueprint', () => {
    const blueprint = service.getBlueprint();

    const project = service.createProject({
      name: 'AVOS Media Test Project',
      description: 'Generated contract test',
      owner: 'AVOS',
    });

    expect(project.id).toBeTruthy();
    expect(project.currentStage).toBe(blueprint.stages[0]?.stage);
    expect(project.stages).toHaveLength(blueprint.stages.length);
    expect(project.stages[0]?.status).toBe('planned');
  });

  it('should start a project safely', () => {
    const project = service.createProject({
      name: 'AVOS Start Test',
      owner: 'AVOS',
    });

    const started = service.startProject(project.id);

    expect(started.status).toBe('running');
    expect(started.stages[0]?.status).toBe('running');
  });
});
