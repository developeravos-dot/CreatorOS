import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getPlatformStatus() {
    return {
      name: 'CreatorOS / AVOS Core API',
      version: '0.1.0',
      phase: 'Phase 1 — Core Platform',
      status: 'operational',
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: '@creatoros/api',
      timestamp: new Date().toISOString(),
    };
  }
}
