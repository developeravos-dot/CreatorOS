import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  CapabilityModule,
} from '../capability.module';
import {
  CapabilityController,
} from '../capability.controller';
import {
  CapabilityService,
} from '../capability.service';
import {
  CapabilityRegistryEngineService,
} from '../registry-engine';
import {
  CapabilityRuntimeAdapterRegistryService,
  CapabilityRuntimeEngineService,
  InMemoryCapabilityRuntimeAdapter,
} from '../runtime-engine';
import {
  DependencyResolverEngineService,
} from '../dependency-resolver';
import {
  PluginHostEngineService,
} from '../plugin-host';
import {
  CapabilityPlatformController,
  CapabilityPlatformManagementController,
  CapabilityPlatformOperationsController,
} from './controllers';
import {
  CapabilityPlatformAuditService,
  CapabilityPlatformManagementService,
  CapabilityPlatformOperationsService,
  CapabilityPlatformService,
} from './services';

describe(
  'CapabilityModule production composition',
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
      'preserves the persistent registry API',
      () => {
        expect(controllers).toContain(
          CapabilityController,
        );

        expect(providers).toContain(
          CapabilityService,
        );

        expect(exports).toContain(
          CapabilityService,
        );
      },
    );

    it(
      'registers all production controllers',
      () => {
        expect(controllers).toContain(
          CapabilityPlatformController,
        );

        expect(controllers).toContain(
          CapabilityPlatformOperationsController,
        );

        expect(controllers).toContain(
          CapabilityPlatformManagementController,
        );
      },
    );

    it(
      'registers management services',
      () => {
        expect(providers).toContain(
          CapabilityPlatformAuditService,
        );

        expect(providers).toContain(
          CapabilityPlatformService,
        );

        expect(providers).toContain(
          CapabilityPlatformOperationsService,
        );

        expect(providers).toContain(
          CapabilityPlatformManagementService,
        );
      },
    );

    it(
      'exports the complete production platform',
      () => {
        const requiredExports = [
          CapabilityRegistryEngineService,
          CapabilityRuntimeAdapterRegistryService,
          InMemoryCapabilityRuntimeAdapter,
          CapabilityRuntimeEngineService,
          DependencyResolverEngineService,
          PluginHostEngineService,
          CapabilityPlatformAuditService,
          CapabilityPlatformService,
          CapabilityPlatformOperationsService,
          CapabilityPlatformManagementService,
        ];

        for (
          const requiredExport
          of requiredExports
        ) {
          expect(exports).toContain(
            requiredExport,
          );
        }
      },
    );
  },
);