import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('CreatorOS');

  info(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  getStatus() {
    return {
      module: 'logging',
      status: 'operational',
      provider: 'NestJS Logger',
      centralized: true,
      structuredLoggingReady: true,
    };
  }
}
