import {
  CAPABILITY_MANIFEST_SCHEMA_VERSION,
  type CapabilityManifestContract,
} from '../contracts';
import { CapabilityIdValue } from '../domain/capability-id.value-object';
import { CapabilityVersionValue } from '../domain/capability-version.value-object';

export interface CreateCapabilityManifestInput
  extends Omit<
    CapabilityManifestContract,
    'schemaVersion' | 'id' | 'version'
  > {
  readonly id: string;
  readonly version: string;
}

export class CapabilityManifestFactory {
  create(
    input: CreateCapabilityManifestInput,
  ): CapabilityManifestContract {
    const id = CapabilityIdValue.create(input.id).value;
    const version = CapabilityVersionValue.create(
      input.version,
    ).value;

    return Object.freeze({
      schemaVersion: CAPABILITY_MANIFEST_SCHEMA_VERSION,
      id,
      name: input.name.trim(),
      version,
      description: input.description.trim(),
      domain: input.domain.trim().toLowerCase(),
      kind: input.kind,
      publisher: Object.freeze({ ...input.publisher }),
      entrypoint: Object.freeze({ ...input.entrypoint }),
      dependencies: Object.freeze(
        input.dependencies.map((dependency) =>
          Object.freeze({ ...dependency }),
        ),
      ),
      policy: Object.freeze({
        ...input.policy,
        security: Object.freeze({
          ...input.policy.security,
          permissions: Object.freeze([
            ...input.policy.security.permissions,
          ]),
        }),
      }),
      compatibility: input.compatibility
        ? Object.freeze({ ...input.compatibility })
        : undefined,
      tags: input.tags
        ? Object.freeze(
            input.tags.map((tag) =>
              tag.trim().toLowerCase(),
            ),
          )
        : undefined,
      metadata: input.metadata
        ? Object.freeze({ ...input.metadata })
        : undefined,
    });
  }
}