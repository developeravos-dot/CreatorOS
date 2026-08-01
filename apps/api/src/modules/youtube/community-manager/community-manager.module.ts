import { Module } from '@nestjs/common';

import {
  CommunityManagerController,
} from './community-manager.controller';

import {
  CommunityManagerService,
} from './community-manager.service';

@Module({
  controllers: [CommunityManagerController],
  providers: [CommunityManagerService],
  exports: [CommunityManagerService],
})
export class CommunityManagerModule {}
