import { Injectable } from '@nestjs/common';

import {
  CapabilityManifestValidatorService,
} from '../../validation';
import type {
  PluginPackageContract,
} from '../contracts';
import {
  PluginPackageValidationError,
} from '../errors/plugin-host.errors';

const PLUGIN_KEY_PATTERN =
  /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

@Injectable()
export class PluginPackageValidatorService {
  constructor(
    private readonly manifestValidator =
      new CapabilityManifestValidatorService(),
  ) {}

  async validate(
    pluginPackage: PluginPackageContract,
  ): Promise<void> {
    if (
      !PLUGIN_KEY_PATTERN.test(
        pluginPackage.pluginKey,
      )
    ) {
      throw new PluginPackageValidationError(
        pluginPackage.pluginKey,
        'Plugin key has an invalid format.',
      );
    }

    if (
      pluginPackage.version !==
      pluginPackage.capabilityManifest.version
    ) {
      throw new PluginPackageValidationError(
        pluginPackage.pluginKey,
        'Plugin version does not match capability manifest version.',
      );
    }

    if (
      pluginPackage.provider.manifest.id !==
      pluginPackage.capabilityManifest.id
    ) {
      throw new PluginPackageValidationError(
        pluginPackage.pluginKey,
        'Provider manifest does not match package capability manifest.',
      );
    }

    if (
      pluginPackage.provider.manifest.version !==
      pluginPackage.version
    ) {
      throw new PluginPackageValidationError(
        pluginPackage.pluginKey,
        'Provider version does not match plugin package version.',
      );
    }

    const validation =
      await this.manifestValidator.validateManifest(
        pluginPackage.capabilityManifest,
      );

    if (!validation.valid) {
      throw new PluginPackageValidationError(
        pluginPackage.pluginKey,
        validation.issues
          .map((issue) => issue.message)
          .join('; '),
      );
    }
  }
}