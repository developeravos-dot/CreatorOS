import { Module } from '@nestjs/common';
import { VirtualProductionStageController } from './virtual-production-stage.controller';
import { VirtualProductionStageService } from './virtual-production-stage.service';

@Module({
  controllers: [VirtualProductionStageController],
  providers: [VirtualProductionStageService],
  exports: [VirtualProductionStageService],
})
export class VirtualProductionStageModule {}
