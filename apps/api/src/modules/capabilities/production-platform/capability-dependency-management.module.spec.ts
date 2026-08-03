import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  CapabilityModule,
} from '../capability.module';
import {
  CapabilityDependencyManagementController,
} from './controllers';
import {
  CapabilityDependencyManagementService,
} from './services';

describe(
  'Capability dependency management module composition',
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
      'registers the dependency management controller',
      () => {
        expect(controllers).toContain(
          CapabilityDependencyManagementController,
        );
      },
    );

    it(
      'registers the dependency management service',
      () => {
        expect(providers).toContain(
          CapabilityDependencyManagementService,
        );
      },
    );

    it(
      'exports the dependency management service',
      () => {
        expect(exports).toContain(
          CapabilityDependencyManagementService,
        );
      },
    );
  },
);