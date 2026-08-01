import { Module } from '@nestjs/common';

import {
  CommentIntelligenceController,
} from './comment-intelligence.controller';

import {
  CommentIntelligenceService,
} from './comment-intelligence.service';

@Module({
  controllers: [CommentIntelligenceController],
  providers: [CommentIntelligenceService],
  exports: [CommentIntelligenceService],
})
export class CommentIntelligenceModule {}
