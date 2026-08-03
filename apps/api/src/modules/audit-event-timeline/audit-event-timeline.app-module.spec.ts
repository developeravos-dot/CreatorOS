import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  AppModule,
} from '../../app.module';
import {
  AuditEventTimelineModule,
} from './audit-event-timeline.module';

describe(
  'Audit event timeline AppModule composition',
  () => {
    it(
      'imports AuditEventTimelineModule',
      () => {
        const imports =
          Reflect.getMetadata(
            MODULE_METADATA.IMPORTS,
            AppModule,
          ) as readonly unknown[];

        expect(imports).toContain(
          AuditEventTimelineModule,
        );
      },
    );
  },
);