import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
  ) {}

  getStatus() {
    const config = this.configService.getPlatformConfig();

    this.loggingService.info(
      'Core platform status requested',
      'CoreService',
    );

    return {
      module: 'core',
      status: 'operational',
      platformName: config.platformName,
      environment: config.environment,
      dependencies: {
        config: 'operational',
        logging: 'operational',
      },
      foundationFirst: config.foundationFirst,
      capabilityFirst: config.capabilityFirst,
      blueprintDriven: config.blueprintDriven,
      humanFinalAuthority: config.humanFinalAuthority,
    };
  }
}
