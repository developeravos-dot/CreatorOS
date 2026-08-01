import { Module } from '@nestjs/common';
import { BrandDesignSystemStageController } from './brand-design-system-stage.controller';
import { BrandDesignSystemStageService } from './brand-design-system-stage.service';

@Module({
  controllers: [BrandDesignSystemStageController],
  providers: [BrandDesignSystemStageService],
  exports: [BrandDesignSystemStageService],
})
export class BrandDesignSystemStageModule {}
