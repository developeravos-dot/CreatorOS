import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  LogsExplorerController,
} from './controllers';
import {
  LogsExplorerModule,
} from './logs-explorer.module';
import {
  LogsExplorerEngineService,
  LogsExplorerExportService,
  LogsExplorerQueryService,
} from './services';

describe(
  'LogsExplorerModule',
  () => {
    const controllers =
      Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        LogsExplorerModule,
      ) as readonly unknown[];

    const providers =
      Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        LogsExplorerModule,
      ) as readonly unknown[];

    const exports =
      Reflect.getMetadata(
        MODULE_METADATA.EXPORTS,
        LogsExplorerModule,
      ) as readonly unknown[];

    it(
      'registers the logs controller',
      () => {
        expect(controllers).toContain(
          LogsExplorerController,
        );
      },
    );

    it(
      'registers logs services',
      () => {
        expect(providers).toContain(
          LogsExplorerEngineService,
        );

        expect(providers).toContain(
          LogsExplorerQueryService,
        );

        expect(providers).toContain(
          LogsExplorerExportService,
        );
      },
    );

    it(
      'exports logs services',
      () => {
        expect(exports).toContain(
          LogsExplorerEngineService,
        );

        expect(exports).toContain(
          LogsExplorerQueryService,
        );

        expect(exports).toContain(
          LogsExplorerExportService,
        );
      },
    );
  },
);