import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ScriptIntelligenceController,
} from './script-intelligence.controller';

import {
  ScriptIntelligenceService,
} from './script-intelligence.service';

describe('ScriptIntelligenceController', () => {
  let controller: ScriptIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ScriptIntelligenceController],
        providers: [ScriptIntelligenceService],
      }).compile();

    controller =
      module.get<ScriptIntelligenceController>(
        ScriptIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create a production record', () => {
    const record = controller.createRecord({
      title: 'Controller Asset',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
