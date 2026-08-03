import type {
  CapabilityCompatibilityContract,
  CapabilityDependencyContract,
  CapabilityDomain,
  CapabilityEntrypointContract,
  CapabilityKind,
  CapabilityManifestContract,
  CapabilityMetadata,
  CapabilityPublisherContract,
  CapabilityResourcePolicyContract,
} from '../../../contracts';
import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
  type CreateCapabilityManifestInput,
} from '../../../manifest';
import {
  CapabilitySdkBuilderValidationError,
  normalizeIdentifier,
  normalizeTags,
  normalizeText,
} from '../shared';
type MutableManifestDraft = {
  id?: string;
  name?: string;
  version?: string;
  description?: string;
  domain?: CapabilityDomain;
  kind?: CapabilityKind;
  publisher?: CapabilityPublisherContract;
  entrypoint?: CapabilityEntrypointContract;
  dependencies:
    CapabilityDependencyContract[];
  policy?: CapabilityResourcePolicyContract;
  compatibility?:
    CapabilityCompatibilityContract;
  tags: string[];
  metadata?: CapabilityMetadata;
};

export class CapabilityManifestBuilder {
  private readonly draft:
    MutableManifestDraft = {
      dependencies: [],
      tags: [],
    };

  id(value: string): this {
    this.draft.id =
      normalizeIdentifier(value);

    return this;
  }

  name(value: string): this {
    this.draft.name = normalizeText(value);
    return this;
  }

  version(value: string): this {
    this.draft.version = normalizeText(value);
    return this;
  }

  description(value: string): this {
    this.draft.description =
      normalizeText(value);

    return this;
  }

  domain(value: CapabilityDomain): this {
    this.draft.domain =
      normalizeIdentifier(value);

    return this;
  }

  kind(value: CapabilityKind): this {
    this.draft.kind = value;
    return this;
  }

  publisher(
    value: CapabilityPublisherContract,
  ): this {
    this.draft.publisher = value;
    return this;
  }

  entrypoint(
    value: CapabilityEntrypointContract,
  ): this {
    this.draft.entrypoint = value;
    return this;
  }

  dependency(
    value: CapabilityDependencyContract,
  ): this {
    const index =
      this.draft.dependencies.findIndex(
        (dependency) =>
          dependency.capabilityId ===
            value.capabilityId &&
          dependency.type === value.type,
      );

    if (index >= 0) {
      this.draft.dependencies[index] = value;
    } else {
      this.draft.dependencies.push(value);
    }

    return this;
  }

  dependencies(
    values:
      readonly CapabilityDependencyContract[],
  ): this {
    for (const value of values) {
      this.dependency(value);
    }

    return this;
  }

  policy(
    value: CapabilityResourcePolicyContract,
  ): this {
    this.draft.policy = value;
    return this;
  }

  compatibility(
    value: CapabilityCompatibilityContract,
  ): this {
    this.draft.compatibility = value;
    return this;
  }

  tag(value: string): this {
    this.draft.tags.push(value);
    return this;
  }

  tags(values: readonly string[]): this {
    this.draft.tags.push(...values);
    return this;
  }

  metadata(value: CapabilityMetadata): this {
    this.draft.metadata = value;
    return this;
  }

  build(): CapabilityManifestContract {
    const issues: string[] = [];

    if (!this.draft.id) {
      issues.push('Capability id is required.');
    }

    if (!this.draft.name) {
      issues.push('Capability name is required.');
    }

    if (!this.draft.version) {
      issues.push(
        'Capability version is required.',
      );
    }

    if (!this.draft.description) {
      issues.push(
        'Capability description is required.',
      );
    }

    if (!this.draft.domain) {
      issues.push(
        'Capability domain is required.',
      );
    }

    if (!this.draft.kind) {
      issues.push('Capability kind is required.');
    }

    if (!this.draft.publisher) {
      issues.push(
        'Capability publisher is required.',
      );
    }

    if (!this.draft.entrypoint) {
      issues.push(
        'Capability entrypoint is required.',
      );
    }

    if (issues.length > 0) {
      throw new CapabilitySdkBuilderValidationError(
        issues,
      );
    }

    const input: CreateCapabilityManifestInput = {
      id: this.draft.id!,
      name: this.draft.name!,
      version: this.draft.version!,
      description:
        this.draft.description!,
      domain: this.draft.domain!,
      kind: this.draft.kind!,
      publisher: this.draft.publisher!,
      entrypoint: this.draft.entrypoint!,
      dependencies:
        this.draft.dependencies,
      policy:
        this.draft.policy ??
        createDefaultCapabilityPolicy(),
      compatibility:
        this.draft.compatibility,
      tags: normalizeTags(
        this.draft.tags,
      ),
      metadata: this.draft.metadata,
    };

    return new CapabilityManifestFactory().create(
      input,
    );
  }
}