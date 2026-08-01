import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ScriptScreenplayIntelligenceController,
} from './script-screenplay-intelligence.controller';

import {
  ScriptScreenplayIntelligenceService,
} from './script-screenplay-intelligence.service';

describe('ScriptScreenplayIntelligenceController', () => {
  let controller: ScriptScreenplayIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          ScriptScreenplayIntelligenceController,
        ],
        providers: [
          ScriptScreenplayIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<ScriptScreenplayIntelligenceController>(
        ScriptScreenplayIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
