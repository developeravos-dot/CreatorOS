import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  AppModule,
} from '../../app.module';
import {
  MonitoringDiagnosticsModule,
} from './monitoring-diagnostics.module';

describe(
  'Monitoring diagnostics AppModule composition',
  () => {
    it(
      'imports MonitoringDiagnosticsModule',
      () => {
        const imports =
          Reflect.getMetadata(
            MODULE_METADATA.IMPORTS,
            AppModule,
          ) as readonly unknown[];

        expect(imports).toContain(
          MonitoringDiagnosticsModule,
        );
      },
    );
  },
);