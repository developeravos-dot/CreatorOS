import { Module } from '@nestjs/common';

import {
  GovernanceAuditAuthorityEngineController,
} from './governance-audit-authority-engine.controller';

import {
  GovernanceAuditAuthorityEngineService,
} from './governance-audit-authority-engine.service';

@Module({
  controllers: [GovernanceAuditAuthorityEngineController],
  providers: [GovernanceAuditAuthorityEngineService],
  exports: [GovernanceAuditAuthorityEngineService],
})
export class GovernanceAuditAuthorityEngineModule {}
