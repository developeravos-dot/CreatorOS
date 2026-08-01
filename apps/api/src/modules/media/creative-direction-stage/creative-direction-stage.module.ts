import { Module } from '@nestjs/common';
import { CreativeDirectionStageController } from './creative-direction-stage.controller';
import { CreativeDirectionStageService } from './creative-direction-stage.service';

@Module({
  controllers: [CreativeDirectionStageController],
  providers: [CreativeDirectionStageService],
  exports: [CreativeDirectionStageService],
})
export class CreativeDirectionStageModule {}
