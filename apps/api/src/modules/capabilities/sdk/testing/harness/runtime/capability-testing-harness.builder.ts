import type {
  CreateCapabilityTestingHarnessInput,
  CapabilityTestingHarness,
  CapabilityTestFixture,
} from '../contracts';
import {
  CapabilityTestFixtureBuilder,
} from '../fixtures';
import {
  MockCapabilityRuntime,
} from '../../runtime';
import type {
  MockSdkContextFixture,
} from '../../mocks';
import {
  DefaultCapabilityTestingHarness,
} from './default-capability-testing-harness';

export class CapabilityTestingHarnessBuilder {
  private fixtureValue?:
    CapabilityTestFixture;

  private contextValue?:
    MockSdkContextFixture;

  private runtimeValue?:
    MockCapabilityRuntime;

  private configurationValue?:
    Readonly<Record<string, unknown>>;

  private servicesValue?:
    ReadonlyMap<string | symbol, unknown>;

  private stateValue?:
    Readonly<Record<string, unknown>>;

  fixture(
    value: CapabilityTestFixture,
  ): this {
    this.fixtureValue = value;
    return this;
  }

  capability(
    capabilityId: string,
    version = '1.0.0',
  ): this {
    this.fixtureValue =
      new CapabilityTestFixtureBuilder()
        .capabilityId(capabilityId)
        .version(version)
        .build();

    return this;
  }

  context(
    value: MockSdkContextFixture,
  ): this {
    this.contextValue = value;
    return this;
  }

  runtime(
    value: MockCapabilityRuntime,
  ): this {
    this.runtimeValue = value;
    return this;
  }

  configuration(
    value:
      Readonly<Record<string, unknown>>,
  ): this {
    this.configurationValue = value;
    return this;
  }

  services(
    value:
      ReadonlyMap<string | symbol, unknown>,
  ): this {
    this.servicesValue = value;
    return this;
  }

  state(
    value:
      Readonly<Record<string, unknown>>,
  ): this {
    this.stateValue = value;
    return this;
  }

  build(): CapabilityTestingHarness {
    const input:
      CreateCapabilityTestingHarnessInput = {
        fixture: this.fixtureValue,
        context: this.contextValue,
        runtime: this.runtimeValue,
        configuration:
          this.configurationValue,
        services: this.servicesValue,
        state: this.stateValue,
      };

    return new DefaultCapabilityTestingHarness(
      input,
    );
  }
}