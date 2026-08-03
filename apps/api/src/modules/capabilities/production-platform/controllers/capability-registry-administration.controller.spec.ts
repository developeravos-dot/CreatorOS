import {
  CapabilityRegistryAdministrationController,
} from './capability-registry-administration.controller';

describe(
  'CapabilityRegistryAdministrationController',
  () => {
    it(
      'delegates registry administration operations',
      async () => {
        const administration = {
          overview:
            jest.fn(async () => ({
              totalCapabilities: 0,
            })),

          consistency:
            jest.fn(async () => ({
              consistent: true,
            })),

          snapshot:
            jest.fn(async () => ({
              count: 0,
            })),

          bulkRegister:
            jest.fn(async () => ({
              requested: 0,
            })),

          bulkUnregister:
            jest.fn(async () => ({
              requested: 0,
            })),

          restore:
            jest.fn(async () => ({
              requested: 0,
            })),

          clear:
            jest.fn(async () => ({
              cleared: true,
            })),
        };

        const controller =
          new CapabilityRegistryAdministrationController(
            administration as never,
          );

        await controller.overview();
        await controller.consistency();
        await controller.snapshot();

        await controller.bulkRegister({
          manifests: [],
        });

        await controller.bulkUnregister({
          capabilityIds: [],
        });

        await controller.restore({
          manifests: [],
        });

        await controller.clear({
          confirmation:
            'CLEAR_CAPABILITY_REGISTRY',
        });

        expect(
          administration.overview,
        ).toHaveBeenCalledTimes(1);

        expect(
          administration.bulkRegister,
        ).toHaveBeenCalledTimes(1);

        expect(
          administration.clear,
        ).toHaveBeenCalledTimes(1);
      },
    );
  },
);