import type {
  CapabilityIdentifier,
  CapabilityValidationSeverity,
} from './capability.types';

export interface CapabilityValidationIssueContract {
  readonly code: string;
  readonly message: string;
  readonly severity: CapabilityValidationSeverity;
  readonly path?: string;
  readonly suggestion?: string;
}

export interface CapabilityValidationResultContract {
  readonly capabilityId?: CapabilityIdentifier;
  readonly valid: boolean;
  readonly issues: readonly CapabilityValidationIssueContract[];
  readonly validatedAt: string;
}