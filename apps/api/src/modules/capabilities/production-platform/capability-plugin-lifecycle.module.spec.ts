import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  CapabilityModule,
} from '../capability.module';
import {
  CapabilityPluginLifecycleController,
} from './controllers';
import {
  CapabilityPluginLifecycleService,
} from './services';

describe(
  'Capability plugin lifecycle module composition',
  () => {
    const controllers =
      Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        CapabilityModule,
      ) as readonly unknown[];

    const providers =
      Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        CapabilityModule,
      ) as readonly unknown[];

    const exports =
      Reflect.getMetadata(
        MODULE_METADATA.EXPORTS,
        CapabilityModule,
      ) as readonly unknown[];

    it(
      'registers the plugin lifecycle controller',
      () => {
        expect(controllers).toContain(
          CapabilityPluginLifecycleController,
        );
      },
    );

    it(
      'registers the plugin lifecycle service',
      () => {
        expect(providers).toContain(
          CapabilityPluginLifecycleService,
        );
      },
    );

    it(
      'exports the plugin lifecycle service',
      () => {
        expect(exports).toContain(
          CapabilityPluginLifecycleService,
        );
      },
    );
  },
);