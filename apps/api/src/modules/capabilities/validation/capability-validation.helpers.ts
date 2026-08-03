import type {
  CapabilityValidationIssueContract,
  CapabilityValidationSeverity,
} from '../contracts';

export const createValidationIssue = (
  code: string,
  message: string,
  severity: CapabilityValidationSeverity,
  path?: string,
  suggestion?: string,
): CapabilityValidationIssueContract => ({
  code,
  message,
  severity,
  path,
  suggestion,
});