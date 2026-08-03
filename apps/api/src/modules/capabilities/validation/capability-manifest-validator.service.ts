import { Injectable } from '@nestjs/common';

import {
  CAPABILITY_MANIFEST_SCHEMA_VERSION,
  type CapabilityDependencyContract,
  type CapabilityManifestContract,
  type CapabilityValidationIssueContract,
  type CapabilityValidationResultContract,
} from '../contracts';
import type { CapabilityValidator } from '../interfaces';
import { createValidationIssue } from './capability-validation.helpers';

const CAPABILITY_ID_PATTERN =
  /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

const SEMANTIC_VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

@Injectable()
export class CapabilityManifestValidatorService
  implements CapabilityValidator
{
  async validateManifest(
    manifest: CapabilityManifestContract,
  ): Promise<CapabilityValidationResultContract> {
    const issues: CapabilityValidationIssueContract[] = [];

    this.validateSchemaVersion(manifest, issues);
    this.validateIdentity(manifest, issues);
    this.validateDescription(manifest, issues);
    this.validateEntrypoint(manifest, issues);
    this.validateDependencies(manifest, issues);
    this.validatePolicy(manifest, issues);
    this.validateTags(manifest, issues);

    return {
      capabilityId: manifest.id,
      valid: !issues.some(
        (issue) => issue.severity === 'error',
      ),
      issues,
      validatedAt: new Date().toISOString(),
    };
  }

  private validateSchemaVersion(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    if (
      manifest.schemaVersion !==
      CAPABILITY_MANIFEST_SCHEMA_VERSION
    ) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_SCHEMA_VERSION_UNSUPPORTED',
          `Unsupported manifest schema version "${manifest.schemaVersion}".`,
          'error',
          'schemaVersion',
          `Use schema version ${CAPABILITY_MANIFEST_SCHEMA_VERSION}.`,
        ),
      );
    }
  }

  private validateIdentity(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    if (!CAPABILITY_ID_PATTERN.test(manifest.id)) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_ID_INVALID',
          'Capability id must use lowercase alphanumeric dot or hyphen segments.',
          'error',
          'id',
        ),
      );
    }

    if (!manifest.name.trim()) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_NAME_REQUIRED',
          'Capability name is required.',
          'error',
          'name',
        ),
      );
    }

    if (!SEMANTIC_VERSION_PATTERN.test(manifest.version)) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_VERSION_INVALID',
          'Capability version must follow semantic versioning.',
          'error',
          'version',
        ),
      );
    }

    if (!manifest.domain.trim()) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_DOMAIN_REQUIRED',
          'Capability domain is required.',
          'error',
          'domain',
        ),
      );
    }
  }

  private validateDescription(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    if (manifest.description.trim().length < 10) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_DESCRIPTION_TOO_SHORT',
          'Capability description should contain at least 10 characters.',
          'warning',
          'description',
        ),
      );
    }
  }

  private validateEntrypoint(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    if (!manifest.entrypoint.module.trim()) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_ENTRYPOINT_MODULE_REQUIRED',
          'Capability entrypoint module is required.',
          'error',
          'entrypoint.module',
        ),
      );
    }

    if (
      manifest.entrypoint.module.includes('..') ||
      manifest.entrypoint.module.includes('\0')
    ) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_ENTRYPOINT_PATH_UNSAFE',
          'Capability entrypoint contains an unsafe path.',
          'error',
          'entrypoint.module',
        ),
      );
    }
  }

  private validateDependencies(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    const seen = new Set<string>();

    for (const dependency of manifest.dependencies) {
      this.validateDependency(
        manifest,
        dependency,
        seen,
        issues,
      );
    }
  }

  private validateDependency(
    manifest: CapabilityManifestContract,
    dependency: CapabilityDependencyContract,
    seen: Set<string>,
    issues: CapabilityValidationIssueContract[],
  ): void {
    if (dependency.capabilityId === manifest.id) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_SELF_DEPENDENCY',
          'A capability cannot depend on itself.',
          'error',
          'dependencies',
        ),
      );
    }

    if (seen.has(dependency.capabilityId)) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_DEPENDENCY_DUPLICATE',
          `Dependency "${dependency.capabilityId}" is declared more than once.`,
          'error',
          'dependencies',
        ),
      );
    }

    seen.add(dependency.capabilityId);

    if (!dependency.versionRange.trim()) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_DEPENDENCY_VERSION_REQUIRED',
          `Dependency "${dependency.capabilityId}" requires a version range.`,
          'error',
          'dependencies',
        ),
      );
    }
  }

  private validatePolicy(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    const limits = manifest.policy.limits;

    if (limits?.timeoutMs !== undefined && limits.timeoutMs <= 0) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_TIMEOUT_INVALID',
          'Capability timeout must be greater than zero.',
          'error',
          'policy.limits.timeoutMs',
        ),
      );
    }

    if (
      limits?.maxConcurrency !== undefined &&
      limits.maxConcurrency <= 0
    ) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_CONCURRENCY_INVALID',
          'Capability concurrency must be greater than zero.',
          'error',
          'policy.limits.maxConcurrency',
        ),
      );
    }

    const permissions =
      manifest.policy.security.permissions;

    if (new Set(permissions).size !== permissions.length) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_PERMISSION_DUPLICATE',
          'Capability security permissions must be unique.',
          'error',
          'policy.security.permissions',
        ),
      );
    }
  }

  private validateTags(
    manifest: CapabilityManifestContract,
    issues: CapabilityValidationIssueContract[],
  ): void {
    if (!manifest.tags) {
      return;
    }

    const normalized = manifest.tags.map((tag) =>
      tag.trim().toLowerCase(),
    );

    if (new Set(normalized).size !== normalized.length) {
      issues.push(
        createValidationIssue(
          'CAPABILITY_TAG_DUPLICATE',
          'Capability tags must be unique.',
          'warning',
          'tags',
        ),
      );
    }
  }
}