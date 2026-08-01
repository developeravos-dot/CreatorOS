import { Module } from '@nestjs/common';

import {
  EvidenceTimestampRegistrationStageController,
} from './evidence-timestamp-registration-stage.controller';

import {
  EvidenceTimestampRegistrationStageService,
} from './evidence-timestamp-registration-stage.service';

@Module({
  controllers: [
    EvidenceTimestampRegistrationStageController,
  ],
  providers: [
    EvidenceTimestampRegistrationStageService,
  ],
  exports: [
    EvidenceTimestampRegistrationStageService,
  ],
})
export class EvidenceTimestampRegistrationStageModule {}
