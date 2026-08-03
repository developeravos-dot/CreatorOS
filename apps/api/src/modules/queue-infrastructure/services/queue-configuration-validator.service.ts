import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  QueueInfrastructureConfiguration,
} from '../configuration';

export interface QueueConfigurationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

@Injectable()
export class QueueConfigurationValidatorService {
  validate(
    configuration: QueueInfrastructureConfiguration,
  ): QueueConfigurationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!configuration.namespace.trim()) {
      errors.push('Queue namespace is required.');
    }

    if (!configuration.redis.host.trim()) {
      errors.push('Redis host is required.');
    }

    if (
      !Number.isSafeInteger(configuration.redis.port) ||
      configuration.redis.port < 1 ||
      configuration.redis.port > 65_535
    ) {
      errors.push(
        'Redis port must be an integer between 1 and 65535.',
      );
    }

    if (
      !Number.isSafeInteger(configuration.redis.database) ||
      configuration.redis.database < 0
    ) {
      errors.push(
        'Redis database must be a non-negative integer.',
      );
    }

    if (
      configuration.defaultJobOptions.attempts < 1 ||
      !Number.isSafeInteger(
        configuration.defaultJobOptions.attempts,
      )
    ) {
      errors.push(
        'Default job attempts must be a positive integer.',
      );
    }

    if (
      configuration.defaultJobOptions.backoff.delayMs < 0 ||
      !Number.isSafeInteger(
        configuration.defaultJobOptions.backoff.delayMs,
      )
    ) {
      errors.push(
        'Default backoff delay must be a non-negative integer.',
      );
    }

    if (
      configuration.worker.defaultConcurrency < 1 ||
      !Number.isSafeInteger(
        configuration.worker.defaultConcurrency,
      )
    ) {
      errors.push(
        'Worker concurrency must be a positive integer.',
      );
    }

    if (
      configuration.health.degradedLatencyMs >=
      configuration.health.unhealthyLatencyMs
    ) {
      errors.push(
        'Degraded latency threshold must be lower than unhealthy latency threshold.',
      );
    }

    if (
      configuration.provider === 'bullmq' &&
      configuration.redis.host === '127.0.0.1'
    ) {
      warnings.push(
        'BullMQ is configured with localhost Redis.',
      );
    }

    if (
      configuration.redis.password &&
      configuration.redis.password.length < 12
    ) {
      warnings.push(
        'Redis password is shorter than 12 characters.',
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  assertValid(
    configuration: QueueInfrastructureConfiguration,
  ): void {
    const result = this.validate(configuration);

    if (!result.valid) {
      throw new BadRequestException({
        message:
          'Queue infrastructure configuration is invalid.',
        errors: result.errors,
      });
    }
  }

  sanitize(
    configuration: QueueInfrastructureConfiguration,
  ): QueueInfrastructureConfiguration {
    return {
      ...configuration,
      redis: {
        ...configuration.redis,
        ...(configuration.redis.password
          ? {
              password: '[REDACTED]',
            }
          : {}),
      },
    };
  }
}
