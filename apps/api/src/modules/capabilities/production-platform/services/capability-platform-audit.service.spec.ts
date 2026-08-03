import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';

describe(
  'CapabilityPlatformAuditService',
  () => {
    it(
      'records auditable platform activity',
      () => {
        const audit =
          new CapabilityPlatformAuditService();

        const record =
          audit.record({
            operation:
              'platform.status-read',
            successful: true,
            actorId: 'tester',
            correlationId:
              'correlation-1',
            metadata: {
              source: 'unit-test',
            },
          });

        expect(record.id).toBeTruthy();

        expect(record).toMatchObject({
          operation:
            'platform.status-read',
          successful: true,
          actorId: 'tester',
          correlationId:
            'correlation-1',
        });

        expect(audit.count()).toBe(1);
        expect(audit.list()).toHaveLength(
          1,
        );
      },
    );

    it(
      'clears audit history',
      () => {
        const audit =
          new CapabilityPlatformAuditService();

        audit.record({
          operation:
            'platform.health-read',
          successful: true,
        });

        audit.clear();

        expect(audit.count()).toBe(0);
        expect(audit.list()).toEqual([]);
      },
    );
  },
);