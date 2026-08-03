import {
  Injectable,
} from '@nestjs/common';
import {
  performance,
} from 'node:perf_hooks';

import type {
  ProcessMetrics,
} from '../contracts';

@Injectable()
export class SystemMetricsService {
  async getProcessMetrics():
    Promise<ProcessMetrics> {
    const responsivenessMs =
      await this.measureResponsiveness();

    const memory =
      process.memoryUsage();

    const cpu =
      process.cpuUsage();

    const uptimeSeconds =
      process.uptime();

    return {
      processId:
        process.pid,
      nodeVersion:
        process.version,
      platform:
        process.platform,
      architecture:
        process.arch,
      uptimeSeconds,
      startedAt:
        new Date(
          Date.now() -
          uptimeSeconds * 1_000,
        ).toISOString(),
      responsivenessMs,
      memory: {
        rssBytes:
          memory.rss,
        heapTotalBytes:
          memory.heapTotal,
        heapUsedBytes:
          memory.heapUsed,
        externalBytes:
          memory.external,
        arrayBuffersBytes:
          memory.arrayBuffers ?? 0,
      },
      cpu: {
        userMicroseconds:
          cpu.user,
        systemMicroseconds:
          cpu.system,
      },
      generatedAt:
        new Date().toISOString(),
    };
  }

  async measureResponsiveness():
    Promise<number> {
    const startedAt =
      performance.now();

    await new Promise<void>(
      (resolve) => {
        setImmediate(resolve);
      },
    );

    return Number(
      (
        performance.now() -
        startedAt
      ).toFixed(3),
    );
  }
}