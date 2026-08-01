import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { TrustSecurityOrchestratorService } from './trust-security-orchestrator.service';
import { IdentityAccessService } from './identity/identity-access.service';
import { SecurityPlatformService } from './security/security-platform.service';
import { MonitoringObservabilityService } from './observability/monitoring-observability.service';

@Controller('trust/security')
export class TrustSecurityController {
  constructor(
    private readonly orchestrator:
      TrustSecurityOrchestratorService,
    private readonly identity:
      IdentityAccessService,
    private readonly security:
      SecurityPlatformService,
    private readonly monitoring:
      MonitoringObservabilityService,
  ) {}

  @Post('bootstrap')
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Post('authorize')
  authorize(
    @Body()
    body: {
      username: string;
      permission: string;
    },
  ) {
    return this.orchestrator.authorize(body);
  }

  @Get('users')
  listUsers() {
    return this.identity.listUsers();
  }

  @Get('roles')
  listRoles() {
    return this.identity.listRoles();
  }

  @Get('policies')
  listPolicies() {
    return this.security.listPolicies();
  }

  @Get('events')
  listSecurityEvents() {
    return this.security.listEvents();
  }

  @Get('health')
  health() {
    return this.monitoring.summary();
  }
}