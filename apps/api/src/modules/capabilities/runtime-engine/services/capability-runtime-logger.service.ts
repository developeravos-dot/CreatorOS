import { Injectable, Logger } from '@nestjs/common';

import type {
  CapabilityLogger,
} from '../../interfaces';
import type {
  CapabilityMetadata,
} from '../../contracts';

@Injectable()
export class CapabilityRuntimeLoggerService
  implements CapabilityLogger
{
  private readonly logger =
    new Logger('CapabilityRuntime');

  debug(
    message: string,
    context?: CapabilityMetadata,
  ): void {
    this.logger.debug(
      context ? { message, context } : message,
    );
  }

  info(
    message: string,
    context?: CapabilityMetadata,
  ): void {
    this.logger.log(
      context ? { message, context } : message,
    );
  }

  warn(
    message: string,
    context?: CapabilityMetadata,
  ): void {
    this.logger.warn(
      context ? { message, context } : message,
    );
  }

  error(
    message: string,
    error?: unknown,
    context?: CapabilityMetadata,
  ): void {
    this.logger.error({
      message,
      error:
        error instanceof Error
          ? error.stack ?? error.message
          : error,
      context,
    });
  }
}