import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreativeProductionService } from './creative-production.service';

describe('CreativeProductionService', () => {
  let service: CreativeProductionService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [CreativeProductionService],
      }).compile();

    service =
      module.get<CreativeProductionService>(
        CreativeProductionService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and list a production task', () => {
    const task = service.createTask({
      title: 'Create launch video',
      type: 'video',
      priority: 'high',
    });

    expect(task.id).toBeDefined();
    expect(task.status).toBe('idea');
    expect(service.listTasks()).toHaveLength(1);
  });

  it('should advance a task through the workflow', () => {
    const task = service.createTask({
      title: 'Create short',
      type: 'short',
    });

    const advanced = service.advanceTask(task.id);

    expect(advanced.status).toBe('planned');
  });

  it('should reject an empty title', () => {
    expect(() =>
      service.createTask({
        title: '   ',
        type: 'video',
      }),
    ).toThrow(BadRequestException);
  });

  it('should calculate dashboard totals', () => {
    service.createTask({
      title: 'Video one',
      type: 'video',
    });

    service.createTask({
      title: 'Short one',
      type: 'short',
      status: 'published',
    });

    const dashboard = service.getDashboard();

    expect(dashboard.totalTasks).toBe(2);
    expect(dashboard.totalsByStatus.published).toBe(1);
    expect(dashboard.completionRate).toBe(50);
  });
});
