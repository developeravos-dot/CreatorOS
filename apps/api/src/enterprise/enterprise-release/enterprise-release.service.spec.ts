import {
  EnterpriseDeploymentHealthService,
  EnterpriseDisasterRecoveryService,
  EnterpriseReleaseManagerService,
} from './services';

describe(
  'Enterprise release foundation',
  () => {
    it(
      'creates and validates production releases',
      () => {
        const service =
          new EnterpriseReleaseManagerService();

        const release =
          service.create({
            releaseId:
              'release-one',
            version: '1.0.0',
            environment:
              'production',
            image:
              'creatoros/api:1.0.0',
            replicas: 3,
          });

        expect(
          service.validate(
            release,
          ).valid,
        ).toBe(true);
      },
    );

    it(
      'validates disaster recovery objectives',
      () => {
        const service =
          new EnterpriseDisasterRecoveryService();

        expect(
          service.validate({
            planId: 'dr-one',
            rpoMinutes: 15,
            rtoMinutes: 30,
            backupRegions: [
              'uae-north',
              'eu-west',
            ],
            automatedFailover: true,
          }).valid,
        ).toBe(true);
      },
    );

    it(
      'assesses deployment quorum health',
      () => {
        const service =
          new EnterpriseDeploymentHealthService();

        expect(
          service.assess([
            {
              replicaId: 'one',
              ready: true,
              healthy: true,
              latencyMs: 20,
            },
            {
              replicaId: 'two',
              ready: true,
              healthy: true,
              latencyMs: 25,
            },
            {
              replicaId: 'three',
              ready: false,
              healthy: false,
              latencyMs: 1000,
            },
          ]).available,
        ).toBe(true);
      },
    );
  },
);
