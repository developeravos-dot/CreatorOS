import { Injectable } from '@nestjs/common';
import { IdentityAccessService } from './identity/identity-access.service';
import { SecurityPlatformService } from './security/security-platform.service';
import { MonitoringObservabilityService } from './observability/monitoring-observability.service';

@Injectable()
export class TrustSecurityOrchestratorService {
  constructor(
    private readonly identity:
      IdentityAccessService,
    private readonly security:
      SecurityPlatformService,
    private readonly monitoring:
      MonitoringObservabilityService,
  ) {}

  bootstrap() {
    this.identity.createRole({
      key: 'platform-owner',
      name: 'Platform Owner',
      permissions: ['*'],
    });

    this.identity.createRole({
      key: 'platform-operator',
      name: 'Platform Operator',
      permissions: [
        'platform.read',
        'platform.execute',
        'monitoring.read',
      ],
    });

    this.identity.createRole({
      key: 'security-auditor',
      name: 'Security Auditor',
      permissions: [
        'security.read',
        'audit.read',
        'monitoring.read',
      ],
    });

    this.identity.createUser({
      username: 'creatoros-owner',
      displayName: 'CreatorOS Owner',
      roleKeys: ['platform-owner'],
    });

    this.security.upsertPolicy({
      key: 'human-final-authority',
      name: 'Human Final Authority',
      enabled: true,
      rules: {
        strategicChangesRequireApproval: true,
        destructiveActionsRequireApproval: true,
      },
    });

    this.security.upsertPolicy({
      key: 'zero-trust-access',
      name: 'Zero Trust Access',
      enabled: true,
      rules: {
        verifyEveryRequest: true,
        leastPrivilege: true,
        denyByDefault: true,
      },
    });

    this.security.upsertPolicy({
      key: 'audit-everything',
      name: 'Audit Everything',
      enabled: true,
      rules: {
        logAuthentication: true,
        logAuthorization: true,
        logSensitiveActions: true,
      },
    });

    this.monitoring.updateHealth(
      'identity-access',
      'healthy',
      {
        users: this.identity.listUsers().length,
        roles: this.identity.listRoles().length,
      },
    );

    this.monitoring.updateHealth(
      'security-platform',
      'healthy',
      {
        policies:
          this.security.listPolicies().length,
      },
    );

    this.monitoring.updateHealth(
      'monitoring-observability',
      'healthy',
      {
        initialized: true,
      },
    );

    this.monitoring.recordMetric({
      component: 'trust-security',
      name: 'bootstrap.success',
      value: 1,
      unit: 'count',
    });

    return this.status();
  }

  authorize(input: {
    username: string;
    permission: string;
  }) {
    const decision =
      this.identity.authorize(
        input.username,
        input.permission,
      );

    this.security.recordEvent({
      type: 'authorization',
      severity: decision.allowed
        ? 'info'
        : 'medium',
      source: 'identity-access',
      message: decision.allowed
        ? 'Access granted.'
        : 'Access denied.',
      metadata: {
        username: input.username,
        permission: input.permission,
        reason: decision.reason,
      },
    });

    this.monitoring.recordMetric({
      component: 'identity-access',
      name: decision.allowed
        ? 'authorization.allowed'
        : 'authorization.denied',
      value: 1,
      unit: 'count',
    });

    return decision;
  }

  status() {
    return {
      name:
        'CreatorOS Trust & Security Mega Pack C',
      version: 'TS-MPC-1.0.0',
      status:
        this.monitoring.summary().status ===
        'healthy'
          ? 'operational'
          : 'degraded',
      systems: {
        identityAccess: true,
        securityPlatform: true,
        monitoringObservability: true,
      },
      metrics: {
        users:
          this.identity.listUsers().length,
        roles:
          this.identity.listRoles().length,
        policies:
          this.security.listPolicies().length,
        securityEvents:
          this.security.listEvents().length,
        monitoring:
          this.monitoring.summary(),
      },
      risk:
        this.security.evaluateRisk(),
      governance: {
        zeroTrust: true,
        leastPrivilege: true,
        auditEverything: true,
        humanFinalAuthority: true,
      },
    };
  }
}