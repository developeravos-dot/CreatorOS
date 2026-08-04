import {
  Module,
} from '@nestjs/common';

import {
  RuntimeProductionController,
} from './runtime-production.controller';
import {
  RuntimeProductionService,
} from './runtime-production.service';
import {
  RuntimeReliabilityService,
} from './runtime-reliability.service';
import {
  RuntimeObservabilityController,
} from './runtime-observability.controller';
import {
  RuntimeObservabilityService,
} from './runtime-observability.service';
import {
  RuntimeProductionHardeningService,
} from './runtime-production-hardening.service';

@Module({
  controllers: [
    RuntimeProductionController,
    RuntimeObservabilityController,
  ],
  providers: [
    RuntimeProductionService,
    RuntimeReliabilityService,
    RuntimeObservabilityService,
    RuntimeProductionHardeningService,
  ],
  exports: [
    RuntimeProductionService,
    RuntimeReliabilityService,
    RuntimeObservabilityService,
    RuntimeProductionHardeningService,
  ],
})
export class RuntimeProductionModule {}
