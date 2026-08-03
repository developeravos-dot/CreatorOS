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
  CapabilityPlatformOperationsController,
} from './controllers';
import {
  CapabilityPlatformAuditService,
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
      'registers production REST controllers',
      () => {
        expect(controllers).toContain(
          CapabilityPlatformController,
        );

        expect(controllers).toContain(
          CapabilityPlatformOperationsController,
        );
      },
    );

    it(
      'registers production services',
      () => {
        expect(providers).toContain(
          CapabilityRegistryEngineService,
        );

        expect(providers).toContain(
          InMemoryCapabilityRuntimeAdapter,
        );

        expect(providers).toContain(
          DependencyResolverEngineService,
        );

        expect(providers).toContain(
          CapabilityPlatformAuditService,
        );

        expect(providers).toContain(
          CapabilityPlatformService,
        );

        expect(providers).toContain(
          CapabilityPlatformOperationsService,
        );

        const factoryTokens = [
          CapabilityRuntimeAdapterRegistryService,
          CapabilityRuntimeEngineService,
          PluginHostEngineService,
        ];

        for (const token of factoryTokens) {
          expect(
            providers.some(
              (provider) =>
                typeof provider ===
                  'object' &&
                provider !== null &&
                'provide' in provider &&
                provider.provide === token,
            ),
          ).toBe(true);
        }
      },
    );

    it(
      'exports the production services',
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