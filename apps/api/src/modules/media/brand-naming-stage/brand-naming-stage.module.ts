import { Module } from '@nestjs/common';
import { BrandNamingStageController } from './brand-naming-stage.controller';
import { BrandNamingStageService } from './brand-naming-stage.service';

@Module({
  controllers: [BrandNamingStageController],
  providers: [BrandNamingStageService],
  exports: [BrandNamingStageService],
})
export class BrandNamingStageModule {}
