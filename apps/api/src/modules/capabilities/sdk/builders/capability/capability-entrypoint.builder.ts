import type {
  CapabilityEntrypointContract,
  CapabilityMetadata,
  CapabilityRuntime,
} from '../../../contracts';
import {
  CapabilitySdkBuilderValidationError,
  normalizeText,
} from '../shared';

export class CapabilityEntrypointBuilder {
  private runtimeValue?: CapabilityRuntime;
  private moduleValue?: string;
  private exportNameValue?: string;
  private bootstrapValue?: string;
  private shutdownValue?: string;
  private metadataValue?: CapabilityMetadata;

  runtime(value: CapabilityRuntime): this {
    this.runtimeValue = value;
    return this;
  }

  module(value: string): this {
    this.moduleValue = normalizeText(value);
    return this;
  }

  exportName(value: string): this {
    this.exportNameValue = normalizeText(value);
    return this;
  }

  bootstrap(value: string): this {
    this.bootstrapValue = normalizeText(value);
    return this;
  }

  shutdown(value: string): this {
    this.shutdownValue = normalizeText(value);
    return this;
  }

  metadata(value: CapabilityMetadata): this {
    this.metadataValue = value;
    return this;
  }

  build(): CapabilityEntrypointContract {
    const issues: string[] = [];

    if (!this.runtimeValue) {
      issues.push('Entrypoint runtime is required.');
    }

    if (!this.moduleValue) {
      issues.push('Entrypoint module is required.');
    }

    if (
      this.moduleValue?.includes('..') ||
      this.moduleValue?.includes('\0')
    ) {
      issues.push('Entrypoint module path is unsafe.');
    }

    if (issues.length > 0) {
      throw new CapabilitySdkBuilderValidationError(
        issues,
      );
    }

    return Object.freeze({
      runtime: this.runtimeValue!,
      module: this.moduleValue!,
      exportName: this.exportNameValue,
      bootstrap: this.bootstrapValue,
      shutdown: this.shutdownValue,
      metadata: this.metadataValue,
    });
  }
}