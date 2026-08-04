import {
  Injectable,
} from '@nestjs/common';

export interface DeploymentReplicaHealth {
  readonly replicaId: string;
  readonly ready: boolean;
  readonly healthy: boolean;
  readonly latencyMs: number;
}

@Injectable()
export class EnterpriseDeploymentHealthService {
  assess(
    replicas:
      readonly DeploymentReplicaHealth[],
  ) {
    if (
      replicas.length === 0
    ) {
      throw new Error(
        'At least one deployment replica is required.',
      );
    }

    const ready =
      replicas.filter(
        (replica) =>
          replica.ready,
      ).length;

    const healthy =
      replicas.filter(
        (replica) =>
          replica.healthy,
      ).length;

    const averageLatencyMs =
      replicas.reduce(
        (total, replica) =>
          total +
          replica.latencyMs,
        0,
      ) / replicas.length;

    return {
      readyReplicas: ready,
      healthyReplicas: healthy,
      totalReplicas:
        replicas.length,
      available:
        ready >=
          Math.ceil(
            replicas.length / 2,
          ) &&
        healthy >=
          Math.ceil(
            replicas.length / 2,
          ),
      averageLatencyMs,
    };
  }
}
