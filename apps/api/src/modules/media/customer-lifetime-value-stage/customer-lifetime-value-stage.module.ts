import { Module } from '@nestjs/common';
import { CustomerLifetimeValueStageController } from './customer-lifetime-value-stage.controller';
import { CustomerLifetimeValueStageService } from './customer-lifetime-value-stage.service';

@Module({
  controllers: [CustomerLifetimeValueStageController],
  providers: [CustomerLifetimeValueStageService],
  exports: [CustomerLifetimeValueStageService],
})
export class CustomerLifetimeValueStageModule {}
