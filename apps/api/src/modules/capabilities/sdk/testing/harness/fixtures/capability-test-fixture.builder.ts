import type {
  CapabilityProvider,
} from '../../../../interfaces';
import {
  CapabilityEntrypointBuilder,
  CapabilityManifestBuilder,
  CapabilityPolicyBuilder,
  CapabilityPublisherBuilder,
} from '../../../builders';
import type {
  CapabilityTestFixture,
  CreateCapabilityTestFixtureInput,
} from '../contracts';
import {
  DefaultCapabilityLifecycleProbe,
} from './capability-lifecycle-probe';

export class CapabilityTestFixtureBuilder {
  private input:
    CreateCapabilityTestFixtureInput = {};

  configure(
    input: CreateCapabilityTestFixtureInput,
  ): this {
    this.input = {
      ...this.input,
      ...input,
    };

    return this;
  }

  capabilityId(value: string): this {
    return this.configure({
      capabilityId: value,
    });
  }

  name(value: string): this {
    return this.configure({
      name: value,
    });
  }

  version(value: string): this {
    return this.configure({
      version: value,
    });
  }

  description(value: string): this {
    return this.configure({
      description: value,
    });
  }

  domain(value: string): this {
    return this.configure({
      domain: value,
    });
  }

  module(value: string): this {
    return this.configure({
      module: value,
    });
  }

  build(): CapabilityTestFixture {
    const capabilityId =
      this.input.capabilityId ??
      'creatoros.capability.testing-harness';

    const version =
      this.input.version ?? '1.0.0';

    const lifecycle =
      new DefaultCapabilityLifecycleProbe();

    const manifest =
      new CapabilityManifestBuilder()
        .id(capabilityId)
        .name(
          this.input.name ??
            'Capability Testing Harness',
        )
        .version(version)
        .description(
          this.input.description ??
            'Capability fixture created by the CreatorOS testing harness.',
        )
        .domain(
          this.input.domain ??
            'platform',
        )
        .kind('extension')
        .publisher(
          new CapabilityPublisherBuilder()
            .name('CreatorOS')
            .organization(
              'CreatorOS Platform',
            )
            .build(),
        )
        .entrypoint(
          new CapabilityEntrypointBuilder()
            .runtime('node')
            .module(
              this.input.module ??
                './testing-harness',
            )
            .exportName(
              'TestingHarnessCapability',
            )
            .build(),
        )
        .policy(
          new CapabilityPolicyBuilder()
            .timeoutMs(30_000)
            .maxConcurrency(1)
            .maxMemoryMb(128)
            .maxRetries(0)
            .build(),
        )
        .tags(
          this.input.tags ?? [
            'sdk',
            'testing',
            'harness',
          ],
        )
        .metadata({
          source:
            'capability-testing-harness',
          ...(this.input.metadata ?? {}),
        })
        .build();

    const provider:
      CapabilityProvider = {
        manifest,
        lifecycle: {
          state: 'registered',
          initialize:
            lifecycle.initialize.bind(
              lifecycle,
            ),
          activate:
            lifecycle.activate.bind(
              lifecycle,
            ),
          stop:
            lifecycle.stop.bind(
              lifecycle,
            ),
        },
      };

    return Object.freeze({
      capabilityId,
      version,
      provider,
      lifecycle,
    });
  }
}