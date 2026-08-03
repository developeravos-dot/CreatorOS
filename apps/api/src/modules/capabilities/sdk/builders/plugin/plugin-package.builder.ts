import type {
  CapabilityManifestContract,
  CapabilityMetadata,
} from '../../contracts';
import type {
  CapabilityProvider,
} from '../../interfaces';
import type {
  PluginPackageContract,
} from '../../plugin-host';
import {
  CapabilitySdkBuilderValidationError,
  normalizeIdentifier,
  normalizeText,
} from '../shared';

export class PluginPackageBuilder {
  private pluginKeyValue?: string;
  private pluginNameValue?: string;
  private pluginDescriptionValue?: string;
  private manifestValue?:
    CapabilityManifestContract;

  private providerValue?:
    CapabilityProvider;

  private checksumValue?: string;
  private signatureValue?: string;
  private metadataValue?: CapabilityMetadata;

  key(value: string): this {
    this.pluginKeyValue =
      normalizeIdentifier(value);

    return this;
  }

  name(value: string): this {
    this.pluginNameValue =
      normalizeText(value);

    return this;
  }

  description(value: string): this {
    this.pluginDescriptionValue =
      normalizeText(value);

    return this;
  }

  manifest(
    value: CapabilityManifestContract,
  ): this {
    this.manifestValue = value;
    return this;
  }

  provider(
    value: CapabilityProvider,
  ): this {
    this.providerValue = value;
    return this;
  }

  checksum(value: string): this {
    this.checksumValue =
      normalizeText(value);

    return this;
  }

  signature(value: string): this {
    this.signatureValue =
      normalizeText(value);

    return this;
  }

  metadata(value: CapabilityMetadata): this {
    this.metadataValue = value;
    return this;
  }

  build(): PluginPackageContract {
    const issues: string[] = [];

    if (!this.pluginKeyValue) {
      issues.push('Plugin key is required.');
    }

    if (!this.pluginNameValue) {
      issues.push('Plugin name is required.');
    }

    if (!this.manifestValue) {
      issues.push(
        'Plugin capability manifest is required.',
      );
    }

    if (!this.providerValue) {
      issues.push(
        'Plugin capability provider is required.',
      );
    }

    if (
      this.manifestValue &&
      this.providerValue &&
      this.providerValue.manifest.id !==
        this.manifestValue.id
    ) {
      issues.push(
        'Plugin provider manifest id does not match package manifest id.',
      );
    }

    if (
      this.manifestValue &&
      this.providerValue &&
      this.providerValue.manifest.version !==
        this.manifestValue.version
    ) {
      issues.push(
        'Plugin provider version does not match package manifest version.',
      );
    }

    if (issues.length > 0) {
      throw new CapabilitySdkBuilderValidationError(
        issues,
      );
    }

    return Object.freeze({
      pluginKey: this.pluginKeyValue!,
      name: this.pluginNameValue!,
      version: this.manifestValue!.version,
      description:
        this.pluginDescriptionValue,
      capabilityManifest:
        this.manifestValue!,
      provider: this.providerValue!,
      checksum: this.checksumValue,
      signature: this.signatureValue,
      metadata: this.metadataValue,
    });
  }
}