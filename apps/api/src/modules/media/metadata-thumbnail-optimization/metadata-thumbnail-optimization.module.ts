import { Module } from '@nestjs/common';

import {
  MetadataThumbnailOptimizationController,
} from './metadata-thumbnail-optimization.controller';

import {
  MetadataThumbnailOptimizationService,
} from './metadata-thumbnail-optimization.service';

@Module({
  controllers: [MetadataThumbnailOptimizationController],
  providers: [MetadataThumbnailOptimizationService],
  exports: [MetadataThumbnailOptimizationService],
})
export class MetadataThumbnailOptimizationModule {}
