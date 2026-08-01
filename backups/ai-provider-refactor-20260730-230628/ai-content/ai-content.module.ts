import { Module } from '@nestjs/common';
import { AiContentController } from './ai-content.controller';
import { AiContentService } from './ai-content.service';

@Module({
  controllers: [AiContentController],
  providers: [AiContentService],
  exports: [AiContentService],
})
export class AiContentModule {}