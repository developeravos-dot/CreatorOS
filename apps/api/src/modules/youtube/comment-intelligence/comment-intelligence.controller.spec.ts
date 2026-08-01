import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CommentIntelligenceController,
} from './comment-intelligence.controller';

import {
  CommentIntelligenceService,
} from './comment-intelligence.service';

describe('CommentIntelligenceController', () => {
  let controller: CommentIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CommentIntelligenceController],
        providers: [CommentIntelligenceService],
      }).compile();

    controller =
      module.get<CommentIntelligenceController>(
        CommentIntelligenceController,
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

  it('should create an audience record', () => {
    const record = controller.createRecord({
      name: 'Controller Audience',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
