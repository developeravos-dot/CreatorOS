import type {
  CapabilityDependencyContract,
  CapabilityDependencyType,
  CapabilityMetadata,
} from '../../contracts';
import {
  CapabilitySdkBuilderValidationError,
  normalizeIdentifier,
  normalizeText,
} from '../shared';

export class CapabilityDependencyBuilder {
  private capabilityIdValue?: string;
  private versionRangeValue?: string;
  private dependencyTypeValue:
    CapabilityDependencyType = 'required';

  private reasonValue?: string;
  private metadataValue?: CapabilityMetadata;

  capability(value: string): this {
    this.capabilityIdValue =
      normalizeIdentifier(value);

    return this;
  }

  version(value: string): this {
    this.versionRangeValue =
      normalizeText(value);

    return this;
  }

  type(value: CapabilityDependencyType): this {
    this.dependencyTypeValue = value;
    return this;
  }

  required(): this {
    return this.type('required');
  }

  optional(): this {
    return this.type('optional');
  }

  peer(): this {
    return this.type('peer');
  }

  reason(value: string): this {
    this.reasonValue = normalizeText(value);
    return this;
  }

  metadata(value: CapabilityMetadata): this {
    this.metadataValue = value;
    return this;
  }

  build(): CapabilityDependencyContract {
    const issues: string[] = [];

    if (!this.capabilityIdValue) {
      issues.push(
        'Dependency capability id is required.',
      );
    }

    if (!this.versionRangeValue) {
      issues.push(
        'Dependency version range is required.',
      );
    }

    if (
      this.capabilityIdValue &&
      !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(
        this.capabilityIdValue,
      )
    ) {
      issues.push(
        'Dependency capability id is invalid.',
      );
    }

    if (issues.length > 0) {
      throw new CapabilitySdkBuilderValidationError(
        issues,
      );
    }

    return Object.freeze({
      capabilityId:
        this.capabilityIdValue!,
      versionRange:
        this.versionRangeValue!,
      type: this.dependencyTypeValue,
      reason: this.reasonValue,
      metadata: this.metadataValue,
    });
  }
}