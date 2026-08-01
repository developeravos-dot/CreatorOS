import { Controller, Get } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get('status')
  getStatus() {
    this.loggingService.info(
      'Logging status endpoint requested',
      'LoggingController',
    );

    return this.loggingService.getStatus();
  }
}
