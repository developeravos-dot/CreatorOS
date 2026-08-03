import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityRegistryAdministrationService,
} from './capability-registry-administration.service';

describe(
  'CapabilityRegistryAdministrationService',
  () => {
    function setup() {
      const records: any[] = [];

      const registry = {
        listRecords:
          jest.fn(async () =>
            records,
          ),

        list:
          jest.fn(async () =>
            records.map(
              (record) =>
                record.manifest,
            ),
          ),

        register:
          jest.fn(
            async (
              manifest: any,
            ) => {
              if (
                records.some(
                  (record) =>
                    record.manifest.id ===
                    manifest.id,
                )
              ) {
                throw new Error(
                  'Capability is already registered.',
                );
              }

              const now =
                new Date().toISOString();

              records.push({
                manifest,
                state:
                  'registered',
                validation: {
                  valid: true,
                  issues: [],
                },
                registeredAt:
                  now,
                updatedAt:
                  now,
              });

              return manifest;
            },
          ),

        unregister:
          jest.fn(
            async (
              capabilityId: string,
            ) => {
              const index =
                records.findIndex(
                  (record) =>
                    record.manifest.id ===
                    capabilityId,
                );

              if (index < 0) {
                throw new Error(
                  'Capability is not registered.',
                );
              }

              records.splice(
                index,
                1,
              );
            },
          ),

        clear:
          jest.fn(async () => {
            records.splice(
              0,
              records.length,
            );
          }),
      };

      const runtimeInstances:
        any[] = [];

      const runtime = {
        listInstances:
          jest.fn(() =>
            runtimeInstances,
          ),

        stop:
          jest.fn(
            async (input: {
              instanceId: string;
            }) => {
              const instance =
                runtimeInstances.find(
                  (item) =>
                    item.instanceId ===
                    input.instanceId,
                );

              if (!instance) {
                throw new Error(
                  'Runtime instance was not found.',
                );
              }

              instance.status =
                'stopped';

              return {
                instanceId:
                  input.instanceId,
                capabilityId:
                  instance.capabilityId,
                previousStatus:
                  'running',
                currentStatus:
                  'stopped',
                lifecycleState:
                  'stopped',
                changed: true,
                completedAt:
                  new Date().toISOString(),
                message:
                  'Stopped.',
              };
            },
          ),
      };

      const audit =
        new CapabilityPlatformAuditService();

      const service =
        new CapabilityRegistryAdministrationService(
          {
            registry,
            runtime,
          } as never,
          audit,
        );

      return {
        service,
        registry,
        runtime,
        records,
        runtimeInstances,
        audit,
      };
    }

    function manifest(
      id: string,
      domain:
        string =
          'platform',
    ) {
      return {
        schemaVersion:
          '1.0.0',
        id,
        name:
          id,
        version:
          '1.0.0',
        description:
          'Registry administration test capability.',
        domain,
        kind:
          'extension',
        publisher: {
          name:
            'CreatorOS',
        },
        entrypoint: {
          runtime:
            'node',
          module:
            `./${id}`,
        },
        dependencies: [],
        policy: {},
      };
    }

    it(
      'builds registry overview and consistency reports',
      async () => {
        const {
          service,
          registry,
        } = setup();

        await registry.register(
          manifest(
            'creatoros.capability.one',
            'platform',
          ),
        );

        await registry.register(
          manifest(
            'creatoros.capability.two',
            'media',
          ),
        );

        const overview =
          await service.overview();

        expect(
          overview.totalCapabilities,
        ).toBe(2);

        expect(
          overview.domains,
        ).toEqual(
          expect.arrayContaining([
            {
              domain:
                'platform',
              capabilities: 1,
            },
            {
              domain:
                'media',
              capabilities: 1,
            },
          ]),
        );

        const consistency =
          await service.consistency();

        expect(
          consistency.consistent,
        ).toBe(true);

        expect(
          consistency.recordCount,
        ).toBe(2);
      },
    );

    it(
      'exports a complete registry snapshot',
      async () => {
        const {
          service,
          registry,
        } = setup();

        await registry.register(
          manifest(
            'creatoros.capability.snapshot',
          ),
        );

        const snapshot =
          await service.snapshot();

        expect(snapshot.count).toBe(
          1,
        );

        expect(
          snapshot.manifests[0]?.id,
        ).toBe(
          'creatoros.capability.snapshot',
        );

        expect(
          snapshot.schemaVersion,
        ).toBe('1.0.0');
      },
    );

    it(
      'performs bulk registration and unregistration',
      async () => {
        const { service } =
          setup();

        const registered =
          await service.bulkRegister({
            manifests: [
              manifest(
                'creatoros.capability.bulk-one',
              ),
              manifest(
                'creatoros.capability.bulk-two',
              ),
            ],
          });

        expect(
          registered.succeeded,
        ).toBe(2);

        const unregistered =
          await service.bulkUnregister({
            capabilityIds: [
              'creatoros.capability.bulk-one',
              'creatoros.capability.missing',
            ],
          });

        expect(
          unregistered.succeeded,
        ).toBe(1);

        expect(
          unregistered.failed,
        ).toBe(1);
      },
    );

    it(
      'blocks registry clear without valid confirmation',
      async () => {
        const { service } =
          setup();

        await expect(
          service.clear({
            confirmation:
              'invalid',
          }),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'blocks clear when runtime instances are active',
      async () => {
        const {
          service,
          runtimeInstances,
        } = setup();

        runtimeInstances.push({
          instanceId:
            'runtime-active',
          capabilityId:
            'creatoros.capability.active',
          status:
            'running',
        });

        await expect(
          service.clear({
            confirmation:
              CapabilityRegistryAdministrationService
                .CLEAR_CONFIRMATION,
          }),
        ).rejects.toBeInstanceOf(
          ConflictException,
        );
      },
    );

    it(
      'force stops runtimes and clears registry',
      async () => {
        const {
          service,
          registry,
          runtime,
          runtimeInstances,
        } = setup();

        await registry.register(
          manifest(
            'creatoros.capability.clear-test',
          ),
        );

        runtimeInstances.push({
          instanceId:
            'runtime-active',
          capabilityId:
            'creatoros.capability.clear-test',
          status:
            'running',
        });

        const result =
          await service.clear({
            confirmation:
              CapabilityRegistryAdministrationService
                .CLEAR_CONFIRMATION,
            force: true,
          });

        expect(result.cleared).toBe(
          true,
        );

        expect(
          result.removedCapabilities,
        ).toBe(1);

        expect(
          result.stoppedRuntimeInstances,
        ).toBe(1);

        expect(
          runtime.stop,
        ).toHaveBeenCalledTimes(1);
      },
    );
  },
);