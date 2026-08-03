import type {
  CapabilityIdentifier,
  CapabilityValidationIssueContract,
  CapabilityValidationResultContract,
  CapabilityValidationSeverity,
} from '../../../contracts';

export interface CreateSdkValidationIssueInput {
  readonly code: string;
  readonly message: string;
  readonly severity?:
    CapabilityValidationSeverity;
  readonly path?: string;
  readonly suggestion?: string;
}

export const createSdkValidationIssue = (
  input: CreateSdkValidationIssueInput,
): CapabilityValidationIssueContract =>
  Object.freeze({
    code: input.code,
    message: input.message,
    severity:
      input.severity ?? 'error',
    path: input.path,
    suggestion: input.suggestion,
  });

export const createSdkValidationResult = (
  capabilityId: CapabilityIdentifier,
  issues:
    readonly CapabilityValidationIssueContract[] =
      [],
): CapabilityValidationResultContract =>
  Object.freeze({
    capabilityId,
    valid: !issues.some(
      (issue) =>
        issue.severity === 'error',
    ),
    issues: Object.freeze([
      ...issues,
    ]),
    validatedAt:
      new Date().toISOString(),
  });

export const mergeSdkValidationResults = (
  capabilityId: CapabilityIdentifier,
  results:
    readonly CapabilityValidationResultContract[],
): CapabilityValidationResultContract => {
  const issues =
    results.flatMap(
      (result) => result.issues,
    );

  return createSdkValidationResult(
    capabilityId,
    issues,
  );
};

export const hasSdkValidationErrors = (
  result: CapabilityValidationResultContract,
): boolean =>
  result.issues.some(
    (issue) =>
      issue.severity === 'error',
  );

export const hasSdkValidationWarnings = (
  result: CapabilityValidationResultContract,
): boolean =>
  result.issues.some(
    (issue) =>
      issue.severity === 'warning',
  );

export const filterSdkValidationIssues = (
  result: CapabilityValidationResultContract,
  severity: CapabilityValidationSeverity,
): readonly CapabilityValidationIssueContract[] =>
  result.issues.filter(
    (issue) =>
      issue.severity === severity,
  );

export const assertSdkValidationResult = (
  result: CapabilityValidationResultContract,
): void => {
  if (result.valid) {
    return;
  }

  const messages = result.issues
    .filter(
      (issue) =>
        issue.severity === 'error',
    )
    .map(
      (issue) =>
        `${issue.code}: ${issue.message}`,
    );

  throw new Error(
    `Capability validation failed for "${result.capabilityId}": ${messages.join('; ')}`,
  );
};