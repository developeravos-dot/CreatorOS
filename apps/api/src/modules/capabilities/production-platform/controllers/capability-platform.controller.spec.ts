import {
  CapabilityPlatformController,
} from './capability-platform.controller';

describe(
  'CapabilityPlatformController',
  () => {
    it(
      'delegates status, health, metrics and audit',
      async () => {
        const platform = {
          status: jest.fn(
            async () => ({
              state:
                'operational',
            }),
          ),
          health: jest.fn(
            async () => ({
              status: 'healthy',
            }),
          ),
          metrics: jest.fn(
            async () => ({
              registeredCapabilities: 0,
            }),
          ),
          auditRecords:
            jest.fn(() => []),
        };

        const controller =
          new CapabilityPlatformController(
            platform as never,
          );

        await expect(
          controller.status(),
        ).resolves.toEqual({
          state: 'operational',
        });

        await expect(
          controller.health(),
        ).resolves.toEqual({
          status: 'healthy',
        });

        await expect(
          controller.metrics(),
        ).resolves.toEqual({
          registeredCapabilities: 0,
        });

        expect(
          controller.audit(),
        ).toEqual([]);

        expect(
          platform.status,
        ).toHaveBeenCalledTimes(1);

        expect(
          platform.health,
        ).toHaveBeenCalledTimes(1);

        expect(
          platform.metrics,
        ).toHaveBeenCalledTimes(1);

        expect(
          platform.auditRecords,
        ).toHaveBeenCalledTimes(1);
      },
    );
  },
);