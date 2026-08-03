import type {
  CapabilityMetadata,
  CapabilityPermission,
  CapabilityResourcePolicyContract,
} from '../../../contracts';
import {
  CapabilitySdkBuilderValidationError,
} from '../shared';

export class CapabilityPolicyBuilder {
  private timeoutMsValue = 30_000;
  private maxConcurrencyValue = 1;
  private maxMemoryMbValue = 256;
  private maxRetriesValue = 0;

  private readonly permissionValues =
    new Set<CapabilityPermission>();

  private networkAccessValue = false;
  private filesystemAccessValue = false;
  private environmentAccessValue = false;
  private processAccessValue = false;
  private metadataValue?: CapabilityMetadata;

  timeoutMs(value: number): this {
    this.timeoutMsValue = value;
    return this;
  }

  maxConcurrency(value: number): this {
    this.maxConcurrencyValue = value;
    return this;
  }

  maxMemoryMb(value: number): this {
    this.maxMemoryMbValue = value;
    return this;
  }

  maxRetries(value: number): this {
    this.maxRetriesValue = value;
    return this;
  }

  permission(value: CapabilityPermission): this {
    this.permissionValues.add(value);
    return this;
  }

  permissions(
    values: readonly CapabilityPermission[],
  ): this {
    for (const value of values) {
      this.permissionValues.add(value);
    }

    return this;
  }

  networkAccess(value = true): this {
    this.networkAccessValue = value;
    return this;
  }

  filesystemAccess(value = true): this {
    this.filesystemAccessValue = value;
    return this;
  }

  environmentAccess(value = true): this {
    this.environmentAccessValue = value;
    return this;
  }

  processAccess(value = true): this {
    this.processAccessValue = value;
    return this;
  }

  metadata(value: CapabilityMetadata): this {
    this.metadataValue = value;
    return this;
  }

  build(): CapabilityResourcePolicyContract {
    const issues: string[] = [];

    if (
      !Number.isInteger(this.timeoutMsValue) ||
      this.timeoutMsValue <= 0
    ) {
      issues.push(
        'Policy timeout must be a positive integer.',
      );
    }

    if (
      !Number.isInteger(
        this.maxConcurrencyValue,
      ) ||
      this.maxConcurrencyValue <= 0
    ) {
      issues.push(
        'Policy max concurrency must be a positive integer.',
      );
    }

    if (
      !Number.isInteger(this.maxMemoryMbValue) ||
      this.maxMemoryMbValue < 16
    ) {
      issues.push(
        'Policy max memory must be at least 16 MB.',
      );
    }

    if (
      !Number.isInteger(this.maxRetriesValue) ||
      this.maxRetriesValue < 0
    ) {
      issues.push(
        'Policy max retries cannot be negative.',
      );
    }

    if (issues.length > 0) {
      throw new CapabilitySdkBuilderValidationError(
        issues,
      );
    }

    return Object.freeze({
      limits: Object.freeze({
        timeoutMs: this.timeoutMsValue,
        maxConcurrency:
          this.maxConcurrencyValue,
        maxMemoryMb:
          this.maxMemoryMbValue,
        maxRetries:
          this.maxRetriesValue,
      }),
      security: Object.freeze({
        permissions: Object.freeze([
          ...this.permissionValues,
        ]),
        networkAccess:
          this.networkAccessValue,
        filesystemAccess:
          this.filesystemAccessValue,
        environmentAccess:
          this.environmentAccessValue,
        processAccess:
          this.processAccessValue,
        metadata: this.metadataValue,
      }),
    });
  }
}