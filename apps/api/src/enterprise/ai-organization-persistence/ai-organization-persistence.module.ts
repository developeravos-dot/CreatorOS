import {
  Module,
} from '@nestjs/common';

import {
  AiOrganizationPersistenceController,
} from './ai-organization-persistence.controller';

import {
  AiOrganizationPersistenceRepository,
} from './ai-organization-persistence.repository';

import {
  AiOrganizationPersistenceService,
} from './ai-organization-persistence.service';

@Module({
  controllers: [
    AiOrganizationPersistenceController,
  ],
  providers: [
    AiOrganizationPersistenceRepository,
    AiOrganizationPersistenceService,
  ],
  exports: [
    AiOrganizationPersistenceService,
  ],
})
export class AiOrganizationPersistenceModule {}
