import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  AuditEventTimelineModule,
} from './audit-event-timeline.module';
import {
  AuditEventTimelineController,
} from './controllers';
import {
  AuditEventEngineService,
  AuditEventExportService,
  AuditEventQueryService,
} from './services';

describe(
  'AuditEventTimelineModule',
  () => {
    const controllers =
      Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        AuditEventTimelineModule,
      ) as readonly unknown[];

    const providers =
      Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        AuditEventTimelineModule,
      ) as readonly unknown[];

    const exports =
      Reflect.getMetadata(
        MODULE_METADATA.EXPORTS,
        AuditEventTimelineModule,
      ) as readonly unknown[];

    it(
      'registers the audit controller',
      () => {
        expect(controllers).toContain(
          AuditEventTimelineController,
        );
      },
    );

    it(
      'registers audit services',
      () => {
        expect(providers).toContain(
          AuditEventEngineService,
        );

        expect(providers).toContain(
          AuditEventQueryService,
        );

        expect(providers).toContain(
          AuditEventExportService,
        );
      },
    );

    it(
      'exports audit services',
      () => {
        expect(exports).toContain(
          AuditEventEngineService,
        );

        expect(exports).toContain(
          AuditEventQueryService,
        );

        expect(exports).toContain(
          AuditEventExportService,
        );
      },
    );
  },
);