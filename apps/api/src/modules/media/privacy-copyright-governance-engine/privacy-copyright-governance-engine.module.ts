import { Module } from '@nestjs/common';

import {
  PrivacyCopyrightGovernanceEngineController,
} from './privacy-copyright-governance-engine.controller';

import {
  PrivacyCopyrightGovernanceEngineService,
} from './privacy-copyright-governance-engine.service';

@Module({
  controllers: [PrivacyCopyrightGovernanceEngineController],
  providers: [PrivacyCopyrightGovernanceEngineService],
  exports: [PrivacyCopyrightGovernanceEngineService],
})
export class PrivacyCopyrightGovernanceEngineModule {}
