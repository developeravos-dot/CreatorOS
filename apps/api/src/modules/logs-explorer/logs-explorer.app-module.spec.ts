import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  AppModule,
} from '../../app.module';
import {
  LogsExplorerModule,
} from './logs-explorer.module';

describe(
  'Logs explorer AppModule composition',
  () => {
    it(
      'imports LogsExplorerModule',
      () => {
        const imports =
          Reflect.getMetadata(
            MODULE_METADATA.IMPORTS,
            AppModule,
          ) as readonly unknown[];

        expect(imports).toContain(
          LogsExplorerModule,
        );
      },
    );
  },
);