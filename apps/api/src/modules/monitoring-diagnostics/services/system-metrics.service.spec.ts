import {
  SystemMetricsService,
} from './system-metrics.service';

describe(
  'SystemMetricsService',
  () => {
    let service:
      SystemMetricsService;

    beforeEach(() => {
      service =
        new SystemMetricsService();
    });

    it(
      'collects safe process metrics',
      async () => {
        const result =
          await service
            .getProcessMetrics();

        expect(result.processId).toBe(
          process.pid,
        );

        expect(result.nodeVersion).toBe(
          process.version,
        );

        expect(result.platform).toBe(
          process.platform,
        );

        expect(
          result.uptimeSeconds,
        ).toBeGreaterThanOrEqual(0);

        expect(
          result.responsivenessMs,
        ).toBeGreaterThanOrEqual(0);

        expect(
          result.memory.rssBytes,
        ).toBeGreaterThan(0);

        expect(
          result.memory.heapTotalBytes,
        ).toBeGreaterThan(0);

        expect(
          result.memory.heapUsedBytes,
        ).toBeGreaterThan(0);

        expect(
          result.cpu.userMicroseconds,
        ).toBeGreaterThanOrEqual(0);

        expect(
          result.cpu.systemMicroseconds,
        ).toBeGreaterThanOrEqual(0);
      },
    );

    it(
      'returns fresh independent snapshots',
      async () => {
        const first =
          await service
            .getProcessMetrics();

        const second =
          await service
            .getProcessMetrics();

        expect(first).not.toBe(second);

        expect(first.memory).not.toBe(
          second.memory,
        );

        expect(first.cpu).not.toBe(
          second.cpu,
        );
      },
    );

    it(
      'does not expose environment variables',
      async () => {
        process.env.MONITORING_TEST_SECRET =
          'top-secret-value';

        try {
          const result =
            await service
              .getProcessMetrics();

          const serialized =
            JSON.stringify(result);

          expect(serialized).not
            .toContain(
              'MONITORING_TEST_SECRET',
            );

          expect(serialized).not
            .toContain(
              'top-secret-value',
            );
        } finally {
          delete process.env
            .MONITORING_TEST_SECRET;
        }
      },
    );
  },
);