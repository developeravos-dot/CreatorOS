import { Module } from '@nestjs/common';
import { RoyaltyAccountingStageController } from './royalty-accounting-stage.controller';
import { RoyaltyAccountingStageService } from './royalty-accounting-stage.service';

@Module({
  controllers: [RoyaltyAccountingStageController],
  providers: [RoyaltyAccountingStageService],
  exports: [RoyaltyAccountingStageService],
})
export class RoyaltyAccountingStageModule {}
