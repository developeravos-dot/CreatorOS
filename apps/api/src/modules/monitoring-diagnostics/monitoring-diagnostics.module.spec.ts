import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  CapabilityModule,
} from '../capabilities/capability.module';
import {
  PersistenceModule,
} from '../persistence';
import {
  MonitoringDiagnosticsController,
} from './controllers';
import {
  MonitoringDiagnosticsModule,
} from './monitoring-diagnostics.module';
import {
  DiagnosticsService,
  MonitoringDiagnosticsService,
  MonitoringMetricsService,
} from './services';

describe(
  'MonitoringDiagnosticsModule',
  () => {
    const imports =
      Reflect.getMetadata(
        MODULE_METADATA.IMPORTS,
        MonitoringDiagnosticsModule,
      ) as readonly unknown[];

    const controllers =
      Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        MonitoringDiagnosticsModule,
      ) as readonly unknown[];

    const providers =
      Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        MonitoringDiagnosticsModule,
      ) as readonly unknown[];

    const exports =
      Reflect.getMetadata(
        MODULE_METADATA.EXPORTS,
        MonitoringDiagnosticsModule,
      ) as readonly unknown[];

    it(
      'imports canonical persistence and capability modules',
      () => {
        expect(imports).toContain(
          PersistenceModule,
        );

        expect(imports).toContain(
          CapabilityModule,
        );
      },
    );

    it(
      'registers the monitoring controller',
      () => {
        expect(controllers).toContain(
          MonitoringDiagnosticsController,
        );
      },
    );

    it(
      'registers monitoring services',
      () => {
        expect(providers).toContain(
          MonitoringDiagnosticsService,
        );

        expect(providers).toContain(
          DiagnosticsService,
        );

        expect(providers).toContain(
          MonitoringMetricsService,
        );
      },
    );

    it(
      'exports primary monitoring services',
      () => {
        expect(exports).toContain(
          MonitoringDiagnosticsService,
        );

        expect(exports).toContain(
          MonitoringMetricsService,
        );
      },
    );
  },
);