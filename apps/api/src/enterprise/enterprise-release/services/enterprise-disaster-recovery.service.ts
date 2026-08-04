import {
  Injectable,
} from '@nestjs/common';

export interface DisasterRecoveryPlan {
  readonly planId: string;
  readonly rpoMinutes: number;
  readonly rtoMinutes: number;
  readonly backupRegions:
    readonly string[];
  readonly automatedFailover: boolean;
}

@Injectable()
export class EnterpriseDisasterRecoveryService {
  validate(
    plan: DisasterRecoveryPlan,
  ) {
    const blockers: string[] = [];

    if (
      !plan.planId.trim()
    ) {
      blockers.push(
        'Recovery plan id is required.',
      );
    }

    if (
      plan.rpoMinutes < 0 ||
      plan.rpoMinutes > 60
    ) {
      blockers.push(
        'RPO must be between zero and sixty minutes.',
      );
    }

    if (
      plan.rtoMinutes < 1 ||
      plan.rtoMinutes > 120
    ) {
      blockers.push(
        'RTO must be between one and one hundred twenty minutes.',
      );
    }

    if (
      new Set(
        plan.backupRegions,
      ).size < 2
    ) {
      blockers.push(
        'At least two unique backup regions are required.',
      );
    }

    if (
      !plan.automatedFailover
    ) {
      blockers.push(
        'Automated failover is required for enterprise production.',
      );
    }

    return {
      valid:
        blockers.length === 0,
      blockers,
    };
  }
}
