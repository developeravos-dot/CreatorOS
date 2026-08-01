import { Module } from '@nestjs/common';
import { BusinessClientSolutionsStageController } from './business-client-solutions-stage.controller';
import { BusinessClientSolutionsStageService } from './business-client-solutions-stage.service';

@Module({
  controllers: [BusinessClientSolutionsStageController],
  providers: [BusinessClientSolutionsStageService],
  exports: [BusinessClientSolutionsStageService],
})
export class BusinessClientSolutionsStageModule {}
