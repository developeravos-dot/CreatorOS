import {
  Module,
} from '@nestjs/common';

import {
  PersistenceModule,
} from '../persistence';
import {
  CapabilityController,
} from './capability.controller';
import {
  CapabilityService,
} from './capability.service';
import {
  CapabilityPlatformController,
  CapabilityPlatformOperationsController,
  CAPABILITY_PRODUCTION_EXPORTS,
  CAPABILITY_PRODUCTION_PROVIDERS,
} from './production-platform';

@Module({
  imports: [
    PersistenceModule,
  ],
  controllers: [
    CapabilityController,
    CapabilityPlatformController,
    CapabilityPlatformOperationsController,
  ],
  providers: [
    CapabilityService,
    ...CAPABILITY_PRODUCTION_PROVIDERS,
  ],
  exports: [
    CapabilityService,
    ...CAPABILITY_PRODUCTION_EXPORTS,
  ],
})
export class CapabilityModule {}