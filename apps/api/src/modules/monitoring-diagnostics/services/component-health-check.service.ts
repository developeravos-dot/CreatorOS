import {
  Injectable,
} from '@nestjs/common';
import {
  performance,
} from 'node:perf_hooks';

import type {
  ComponentHealthCheckOptions,
  ComponentHealthProbeResult,
  ComponentHealthResult,
} from '../contracts';

@Injectable()
export class ComponentHealthCheckService {
  static readonly DEFAULT_TIMEOUT_MS =
    2_000;

  async run(
    options:
      ComponentHealthCheckOptions,
    probe:
      () =>
        | ComponentHealthProbeResult
        | Promise<ComponentHealthProbeResult>,
  ): Promise<ComponentHealthResult> {
    const startedAt =
      performance.now();

    const timeoutMs =
      this.normalizeTimeout(
        options.timeoutMs,
      );

    let timeoutHandle:
      NodeJS.Timeout | undefined;

    try {
      const timeoutPromise =
        new Promise<never>(
          (_, reject) => {
            timeoutHandle =
              setTimeout(() => {
                reject(
                  new ComponentHealthTimeoutError(
                    options.component,
                    timeoutMs,
                  ),
                );
              }, timeoutMs);

            timeoutHandle.unref?.();
          },
        );

      const result =
        await Promise.race([
          Promise.resolve().then(
            probe,
          ),
          timeoutPromise,
        ]);

      return {
        component:
          options.component,
        status:
          result.status,
        message:
          result.message,
        latencyMs:
          this.elapsedMilliseconds(
            startedAt,
          ),
        checkedAt:
          new Date().toISOString(),
        details: {
          ...(result.details ?? {}),
        },
      };
    } catch (error) {
      const timedOut =
        error instanceof
        ComponentHealthTimeoutError;

      return {
        component:
          options.component,
        status: timedOut
          ? (
              options.timeoutStatus ??
              'unhealthy'
            )
          : 'unhealthy',
        message: timedOut
          ? (
              options.timeoutMessage ??
              `${options.component} health check timed out.`
            )
          : this.sanitizeErrorMessage(
              error,
            ),
        latencyMs:
          this.elapsedMilliseconds(
            startedAt,
          ),
        checkedAt:
          new Date().toISOString(),
        details: {
          failed: true,
          timedOut,
          timeoutMs:
            timedOut
              ? timeoutMs
              : undefined,
        },
      };
    } finally {
      if (timeoutHandle) {
        clearTimeout(
          timeoutHandle,
        );
      }
    }
  }

  private normalizeTimeout(
    timeoutMs?: number,
  ): number {
    if (
      timeoutMs === undefined ||
      !Number.isFinite(timeoutMs) ||
      timeoutMs <= 0
    ) {
      return ComponentHealthCheckService
        .DEFAULT_TIMEOUT_MS;
    }

    return Math.max(
      1,
      Math.floor(timeoutMs),
    );
  }

  private elapsedMilliseconds(
    startedAt: number,
  ): number {
    return Number(
      (
        performance.now() -
        startedAt
      ).toFixed(3),
    );
  }

  private sanitizeErrorMessage(
    error: unknown,
  ): string {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const sanitized =
      message
        .replace(
          /(?:postgres(?:ql)?|mysql|mongodb):\/\/[^\s]+/gi,
          '[REDACTED_CONNECTION_STRING]',
        )
        .replace(
          /(DATABASE_URL|API_KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*[^\s,;]+/gi,
          '$1=[REDACTED]',
        )
        .replace(
          /(?:Bearer\s+)[A-Za-z0-9._~+/-]+=*/gi,
          'Bearer [REDACTED]',
        )
        .replace(
          /[A-Za-z]:\\[^\r\n]+/g,
          '[REDACTED_PATH]',
        );

    return sanitized ||
      'Component health check failed.';
  }
}

export class ComponentHealthTimeoutError
  extends Error {
  constructor(
    readonly component: string,
    readonly timeoutMs: number,
  ) {
    super(
      `${component} health check exceeded ${timeoutMs} milliseconds.`,
    );

    this.name =
      'ComponentHealthTimeoutError';
  }
}