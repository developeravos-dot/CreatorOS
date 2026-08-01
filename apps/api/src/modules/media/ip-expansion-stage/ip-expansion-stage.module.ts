import { Module } from '@nestjs/common';
import { IpExpansionStageController } from './ip-expansion-stage.controller';
import { IpExpansionStageService } from './ip-expansion-stage.service';

@Module({
  controllers: [IpExpansionStageController],
  providers: [IpExpansionStageService],
  exports: [IpExpansionStageService],
})
export class IpExpansionStageModule {}
