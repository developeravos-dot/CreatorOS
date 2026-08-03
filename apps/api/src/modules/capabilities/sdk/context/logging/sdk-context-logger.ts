import { Logger } from '@nestjs/common';

import type {
  CapabilityMetadata,
} from '../../../contracts';
import type {
  CapabilityLogger,
} from '../../../interfaces';

export class SdkContextLogger
  implements CapabilityLogger
{
  private readonly logger: Logger;

  constructor(
    contextName = 'CapabilitySdk',
  ) {
    this.logger = new Logger(contextName);
  }

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