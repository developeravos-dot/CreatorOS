import {
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  MonitoringDiagnosticsController,
} from './monitoring-diagnostics.controller';

describe(
  'MonitoringDiagnosticsController',
  () => {
    function setup() {
      const monitoring = {
        liveness:
          jest.fn(
            async () => ({
              alive: true,
              status:
                'healthy',
            }),
          ),

        readiness:
          jest.fn(
            async () => ({
              ready: true,
              status:
                'healthy',
            }),
          ),

        health:
          jest.fn(
            async () => ({
              status:
                'healthy',
            }),
          ),
      };

      const diagnostics = {
        getDiagnostics:
          jest.fn(
            async () => ({
              status:
                'healthy',
              issues: [],
              recommendations: [],
            }),
          ),
      };

      const metrics = {
        getMetrics:
          jest.fn(
            async () => ({
              process: {},
            }),
          ),
      };

      const controller =
        new MonitoringDiagnosticsController(
          monitoring as never,
          diagnostics as never,
          metrics as never,
        );

      return {
        controller,
        monitoring,
        diagnostics,
        metrics,
      };
    }

    it(
      'delegates all monitoring routes',
      async () => {
        const {
          controller,
          monitoring,
          diagnostics,
          metrics,
        } = setup();

        await controller.liveness();
        await controller.readiness();
        await controller.health();

        await controller
          .diagnosticsSummary();

        await controller
          .metricsSummary();

        expect(
          monitoring.liveness,
        ).toHaveBeenCalledTimes(1);

        expect(
          monitoring.readiness,
        ).toHaveBeenCalledTimes(1);

        expect(
          monitoring.health,
        ).toHaveBeenCalledTimes(1);

        expect(
          diagnostics.getDiagnostics,
        ).toHaveBeenCalledTimes(1);

        expect(
          metrics.getMetrics,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'throws service unavailable when readiness fails',
      async () => {
        const {
          controller,
          monitoring,
        } = setup();

        monitoring.readiness
          .mockResolvedValueOnce({
            ready: false,
            status:
              'unhealthy',
          });

        await expect(
          controller.readiness(),
        ).rejects.toBeInstanceOf(
          ServiceUnavailableException,
        );
      },
    );

    it(
      'throws service unavailable for unhealthy health',
      async () => {
        const {
          controller,
          monitoring,
        } = setup();

        monitoring.health
          .mockResolvedValueOnce({
            status:
              'unhealthy',
          });

        await expect(
          controller.health(),
        ).rejects.toBeInstanceOf(
          ServiceUnavailableException,
        );
      },
    );

    it(
      'returns degraded health without throwing',
      async () => {
        const {
          controller,
          monitoring,
        } = setup();

        monitoring.health
          .mockResolvedValueOnce({
            status:
              'degraded',
          });

        await expect(
          controller.health(),
        ).resolves.toEqual({
          status:
            'degraded',
        });
      },
    );
  },
);