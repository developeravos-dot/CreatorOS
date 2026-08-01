import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getPlatformConfig() {
    return {
      platformName: 'CreatorOS / AVOS',
      environment: process.env.NODE_ENV ?? 'development',
      apiPort: Number(process.env.CREATOROS_API_PORT ?? 3000),
      apiPrefix: 'api/v1',
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    };
  }
}
