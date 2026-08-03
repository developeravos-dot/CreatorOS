import 'reflect-metadata';

import {
  MODULE_METADATA,
} from '@nestjs/common/constants';

import {
  CapabilityModule,
} from '../capability.module';
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
  CapabilityPlatformService,
} from './services';

describe(
  'CapabilityModule production composition',
  () => {
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
      'preserves the persistent capability service',
      () => {
        expect(providers).toContain(
          CapabilityService,
        );

        expect(exports).toContain(
          CapabilityService,
        );
      },
    );

    it(
      'registers production capability providers',
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
          CapabilityPlatformService,
        );

        expect(
          providers.some(
            (provider) =>
              typeof provider === 'object' &&
              provider !== null &&
              'provide' in provider &&
              provider.provide ===
                CapabilityRuntimeAdapterRegistryService,
          ),
        ).toBe(true);

        expect(
          providers.some(
            (provider) =>
              typeof provider === 'object' &&
              provider !== null &&
              'provide' in provider &&
              provider.provide ===
                CapabilityRuntimeEngineService,
          ),
        ).toBe(true);

        expect(
          providers.some(
            (provider) =>
              typeof provider === 'object' &&
              provider !== null &&
              'provide' in provider &&
              provider.provide ===
                PluginHostEngineService,
          ),
        ).toBe(true);
      },
    );

    it(
      'exports the complete production composition',
      () => {
        const requiredExports = [
          CapabilityRegistryEngineService,
          CapabilityRuntimeAdapterRegistryService,
          InMemoryCapabilityRuntimeAdapter,
          CapabilityRuntimeEngineService,
          DependencyResolverEngineService,
          PluginHostEngineService,
          CapabilityPlatformService,
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