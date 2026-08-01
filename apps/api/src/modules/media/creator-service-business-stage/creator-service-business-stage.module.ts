import { Module } from '@nestjs/common';
import { CreatorServiceBusinessStageController } from './creator-service-business-stage.controller';
import { CreatorServiceBusinessStageService } from './creator-service-business-stage.service';

@Module({
  controllers: [CreatorServiceBusinessStageController],
  providers: [CreatorServiceBusinessStageService],
  exports: [CreatorServiceBusinessStageService],
})
export class CreatorServiceBusinessStageModule {}
