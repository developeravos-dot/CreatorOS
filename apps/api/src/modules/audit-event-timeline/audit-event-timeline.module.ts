import {
  Module,
} from '@nestjs/common';

import {
  AuditEventTimelineController,
} from './controllers';
import {
  AuditEventEngineService,
  AuditEventExportService,
  AuditEventQueryService,
} from './services';

@Module({
  controllers: [
    AuditEventTimelineController,
  ],
  providers: [
    AuditEventEngineService,
    AuditEventQueryService,
    AuditEventExportService,
  ],
  exports: [
    AuditEventEngineService,
    AuditEventQueryService,
    AuditEventExportService,
  ],
})
export class AuditEventTimelineModule {}