import { Module } from '@nestjs/common';

import {
  OperationsCommandCenterController,
} from './operations-command-center.controller';

import {
  OperationsCommandCenterService,
} from './operations-command-center.service';

@Module({
  controllers: [OperationsCommandCenterController],
  providers: [OperationsCommandCenterService],
  exports: [OperationsCommandCenterService],
})
export class OperationsCommandCenterModule {}
