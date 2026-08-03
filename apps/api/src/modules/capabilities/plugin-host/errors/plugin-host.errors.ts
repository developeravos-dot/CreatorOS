export class PluginHostError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = 'PluginHostError';
  }
}

export class PluginAlreadyInstalledError
  extends PluginHostError
{
  constructor(pluginKey: string) {
    super(
      `Plugin "${pluginKey}" is already installed.`,
      'PLUGIN_ALREADY_INSTALLED',
      { pluginKey },
    );

    this.name = 'PluginAlreadyInstalledError';
  }
}

export class PluginNotInstalledError
  extends PluginHostError
{
  constructor(pluginKey: string) {
    super(
      `Plugin "${pluginKey}" is not installed.`,
      'PLUGIN_NOT_INSTALLED',
      { pluginKey },
    );

    this.name = 'PluginNotInstalledError';
  }
}

export class PluginAlreadyActiveError
  extends PluginHostError
{
  constructor(pluginKey: string) {
    super(
      `Plugin "${pluginKey}" is already active.`,
      'PLUGIN_ALREADY_ACTIVE',
      { pluginKey },
    );

    this.name = 'PluginAlreadyActiveError';
  }
}

export class PluginDependencyResolutionError
  extends PluginHostError
{
  constructor(
    pluginKey: string,
    readonly issues: readonly unknown[],
  ) {
    super(
      `Plugin "${pluginKey}" has unresolved dependencies.`,
      'PLUGIN_DEPENDENCY_RESOLUTION_FAILED',
      { pluginKey, issues },
    );

    this.name = 'PluginDependencyResolutionError';
  }
}

export class PluginPackageValidationError
  extends PluginHostError
{
  constructor(
    pluginKey: string,
    message: string,
  ) {
    super(
      `Plugin package "${pluginKey}" is invalid: ${message}`,
      'PLUGIN_PACKAGE_INVALID',
      { pluginKey, message },
    );

    this.name = 'PluginPackageValidationError';
  }
}

export class PluginUninstallBlockedError
  extends PluginHostError
{
  constructor(pluginKey: string) {
    super(
      `Plugin "${pluginKey}" is active and cannot be uninstalled without force.`,
      'PLUGIN_UNINSTALL_BLOCKED',
      { pluginKey },
    );

    this.name = 'PluginUninstallBlockedError';
  }
}