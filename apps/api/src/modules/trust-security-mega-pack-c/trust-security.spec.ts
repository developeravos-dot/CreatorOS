import { IdentityAccessService } from './identity/identity-access.service';
import { SecurityPlatformService } from './security/security-platform.service';
import { MonitoringObservabilityService } from './observability/monitoring-observability.service';
import { TrustSecurityOrchestratorService } from './trust-security-orchestrator.service';

describe(
  'CreatorOS Trust & Security Mega Pack C',
  () => {
    function setup() {
      const identity =
        new IdentityAccessService();
      const security =
        new SecurityPlatformService();
      const monitoring =
        new MonitoringObservabilityService();
      const orchestrator =
        new TrustSecurityOrchestratorService(
          identity,
          security,
          monitoring,
        );

      return {
        identity,
        security,
        monitoring,
        orchestrator,
      };
    }

    it(
      'bootstraps all trust and security systems',
      () => {
        const { orchestrator } =
          setup();

        const status =
          orchestrator.bootstrap();

        expect(status.status).toBe(
          'operational',
        );
        expect(
          status.metrics.users,
        ).toBe(1);
        expect(
          status.metrics.roles,
        ).toBe(3);
        expect(
          status.metrics.policies,
        ).toBe(3);
      },
    );

    it(
      'grants owner permissions',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const decision =
          orchestrator.authorize({
            username: 'creatoros-owner',
            permission:
              'platform.execute',
          });

        expect(decision.allowed).toBe(
          true,
        );
      },
    );

    it(
      'denies missing permissions',
      () => {
        const {
          identity,
          orchestrator,
        } = setup();

        orchestrator.bootstrap();

        identity.createUser({
          username: 'auditor',
          displayName:
            'Security Auditor',
          roleKeys: [
            'security-auditor',
          ],
        });

        const decision =
          orchestrator.authorize({
            username: 'auditor',
            permission:
              'platform.execute',
          });

        expect(decision.allowed).toBe(
          false,
        );
      },
    );

    it(
      'records security events',
      () => {
        const {
          orchestrator,
          security,
        } = setup();

        orchestrator.bootstrap();

        orchestrator.authorize({
          username: 'creatoros-owner',
          permission:
            'platform.read',
        });

        expect(
          security.listEvents(),
        ).toHaveLength(1);
      },
    );

    it(
      'evaluates platform risk',
      () => {
        const {
          orchestrator,
          security,
        } = setup();

        orchestrator.bootstrap();

        security.recordEvent({
          type: 'threat',
          severity: 'high',
          source: 'test',
          message:
            'High-severity test threat.',
        });

        expect(
          security.evaluateRisk().risk,
        ).toBe('high');
      },
    );

    it(
      'reports healthy observability',
      () => {
        const {
          orchestrator,
          monitoring,
        } = setup();

        orchestrator.bootstrap();

        expect(
          monitoring.summary().status,
        ).toBe('healthy');
        expect(
          monitoring
            .summary()
            .components,
        ).toBe(3);
      },
    );

    it(
      'reports all three trust systems',
      () => {
        const { orchestrator } =
          setup();

        orchestrator.bootstrap();

        const status =
          orchestrator.status();

        expect(
          status.systems.identityAccess,
        ).toBe(true);
        expect(
          status.systems.securityPlatform,
        ).toBe(true);
        expect(
          status.systems
            .monitoringObservability,
        ).toBe(true);
      },
    );
  },
);