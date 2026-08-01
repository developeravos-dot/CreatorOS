import { randomUUID } from 'node:crypto';

export type PluginType =
  | 'core'
  | 'capability'
  | 'integration'
  | 'agent'
  | 'extension'
  | 'custom';

export type PluginLifecycleStatus =
  | 'registered'
  | 'validated'
  | 'loaded'
  | 'started'
  | 'stopped'
  | 'disabled'
  | 'unloaded'
  | 'failed';

export type RuntimeHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'unknown';

export interface RuntimeVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface PluginDependency {
  pluginKey: string;
  minimumVersion?: string;
  optional: boolean;
}

export interface PluginCapability {
  key: string;
  name: string;
  description?: string;
  version: string;
}

export interface PluginManifest {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: string;
  type: PluginType;
  runtimeCompatibility: string;
  enabled: boolean;
  autoStart: boolean;
  dependencies: PluginDependency[];
  capabilities: PluginCapability[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimePlugin {
  manifest: PluginManifest;
  status: PluginLifecycleStatus;
  health: RuntimeHealthStatus;
  registeredAt: string;
  validatedAt?: string;
  loadedAt?: string;
  startedAt?: string;
  stoppedAt?: string;
  disabledAt?: string;
  unloadedAt?: string;
  failedAt?: string;
  failureReason?: string;
}

export interface CapabilityBinding {
  id: string;
  capabilityKey: string;
  capabilityName: string;
  capabilityVersion: string;
  pluginId: string;
  pluginKey: string;
  status: 'available' | 'active' | 'inactive';
  loadedAt: string;
}

export interface RuntimeLifecycleEvent {
  id: string;
  pluginId: string;
  pluginKey: string;
  action:
    | 'registered'
    | 'validated'
    | 'loaded'
    | 'started'
    | 'stopped'
    | 'enabled'
    | 'disabled'
    | 'unloaded'
    | 'failed';
  previousStatus?: PluginLifecycleStatus;
  currentStatus: PluginLifecycleStatus;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface RegisterPluginInput {
  key: string;
  name: string;
  description?: string;
  version: string;
  type: PluginType;
  runtimeCompatibility?: string;
  enabled?: boolean;
  autoStart?: boolean;
  dependencies?: Array<{
    pluginKey: string;
    minimumVersion?: string;
    optional?: boolean;
  }>;
  capabilities?: Array<{
    key: string;
    name: string;
    description?: string;
    version?: string;
  }>;
  metadata?: Record<string, unknown>;
}

export interface RuntimeBootstrapResult {
  registered: number;
  validated: number;
  loaded: number;
  started: number;
  failed: number;
}

export class RuntimeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeValidationError';
  }
}

export class RuntimePluginNotFoundError extends Error {
  constructor(pluginId: string) {
    super(`Runtime plugin ${pluginId} was not found`);
    this.name = 'RuntimePluginNotFoundError';
  }
}

export class RuntimeDependencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeDependencyError';
  }
}

export class RuntimeCompatibilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeCompatibilityError';
  }
}

export class RuntimeLifecycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeLifecycleError';
  }
}

export class InMemoryRuntimeEngine {
  private readonly runtimeVersion = '0.1.0';

  private readonly plugins =
    new Map<string, RuntimePlugin>();

  private readonly pluginIdsByKey =
    new Map<string, string>();

  private readonly capabilities =
    new Map<string, CapabilityBinding>();

  private readonly lifecycleEvents:
    RuntimeLifecycleEvent[] = [];

  registerPlugin(
    input: RegisterPluginInput,
  ): RuntimePlugin {
    const normalizedKey =
      input.key.trim().toLowerCase();

    const normalizedName =
      input.name.trim();

    if (!normalizedKey) {
      throw new RuntimeValidationError(
        'Plugin key is required',
      );
    }

    if (!normalizedName) {
      throw new RuntimeValidationError(
        'Plugin name is required',
      );
    }

    if (!input.version.trim()) {
      throw new RuntimeValidationError(
        'Plugin version is required',
      );
    }

    if (this.pluginIdsByKey.has(normalizedKey)) {
      throw new RuntimeValidationError(
        `Plugin key ${normalizedKey} is already registered`,
      );
    }

    const timestamp = new Date().toISOString();

    const dependencies: PluginDependency[] =
      (input.dependencies ?? []).map(
        (dependency): PluginDependency => {
          const record: PluginDependency = {
            pluginKey:
              dependency.pluginKey
                .trim()
                .toLowerCase(),
            optional:
              dependency.optional ?? false,
          };

          if (
            dependency.minimumVersion !==
            undefined
          ) {
            record.minimumVersion =
              dependency.minimumVersion;
          }

          return record;
        },
      );

    const capabilities: PluginCapability[] =
      (input.capabilities ?? []).map(
        (capability): PluginCapability => {
          const record: PluginCapability = {
            key:
              capability.key
                .trim()
                .toLowerCase(),
            name: capability.name.trim(),
            version:
              capability.version ??
              input.version,
          };

          if (
            capability.description !==
            undefined
          ) {
            record.description =
              capability.description;
          }

          return record;
        },
      );

    const duplicateCapabilities =
      capabilities
        .map((capability) => capability.key)
        .filter(
          (key, index, keys) =>
            keys.indexOf(key) !== index,
        );

    if (duplicateCapabilities.length > 0) {
      throw new RuntimeValidationError(
        'Plugin capability keys must be unique',
      );
    }

    const manifest: PluginManifest = {
      id: randomUUID(),
      key: normalizedKey,
      name: normalizedName,
      version: input.version,
      type: input.type,
      runtimeCompatibility:
        input.runtimeCompatibility ?? '^0.1.0',
      enabled: input.enabled ?? true,
      autoStart: input.autoStart ?? true,
      dependencies,
      capabilities,
      metadata: input.metadata ?? {},
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (input.description !== undefined) {
      manifest.description =
        input.description;
    }

    const plugin: RuntimePlugin = {
      manifest,
      status: manifest.enabled
        ? 'registered'
        : 'disabled',
      health: 'unknown',
      registeredAt: timestamp,
    };

    if (!manifest.enabled) {
      plugin.disabledAt = timestamp;
    }

    this.plugins.set(
      manifest.id,
      plugin,
    );

    this.pluginIdsByKey.set(
      manifest.key,
      manifest.id,
    );

    this.recordLifecycleEvent(
      plugin,
      'registered',
      undefined,
      plugin.status,
      {
        version: manifest.version,
        type: manifest.type,
      },
    );

    return plugin;
  }

  getPlugins(): RuntimePlugin[] {
    return Array.from(
      this.plugins.values(),
    );
  }

  getPluginById(
    pluginId: string,
  ): RuntimePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginByKey(
    pluginKey: string,
  ): RuntimePlugin | undefined {
    const pluginId =
      this.pluginIdsByKey.get(
        pluginKey.trim().toLowerCase(),
      );

    if (!pluginId) {
      return undefined;
    }

    return this.plugins.get(pluginId);
  }

  validatePlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    this.ensurePluginEnabled(plugin);

    if (
      plugin.status !== 'registered' &&
      plugin.status !== 'stopped' &&
      plugin.status !== 'unloaded' &&
      plugin.status !== 'validated'
    ) {
      throw new RuntimeLifecycleError(
        `Plugin ${plugin.manifest.key} cannot be validated from status ${plugin.status}`,
      );
    }

    this.validateRuntimeCompatibility(plugin);
    this.validateDependencies(plugin);

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.status = 'validated';
    plugin.validatedAt = timestamp;
    plugin.health = 'healthy';
    delete plugin.failureReason;
    delete plugin.failedAt;

    this.recordLifecycleEvent(
      plugin,
      'validated',
      previousStatus,
      plugin.status,
      {
        dependencies:
          plugin.manifest.dependencies.length,
        capabilities:
          plugin.manifest.capabilities.length,
      },
    );

    return plugin;
  }

  loadPlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    this.ensurePluginEnabled(plugin);

    if (plugin.status === 'registered') {
      this.validatePlugin(pluginId);
    }

    if (
      plugin.status !== 'validated' &&
      plugin.status !== 'unloaded' &&
      plugin.status !== 'stopped'
    ) {
      throw new RuntimeLifecycleError(
        `Plugin ${plugin.manifest.key} cannot be loaded from status ${plugin.status}`,
      );
    }

    this.validateDependencies(plugin);

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.status = 'loaded';
    plugin.loadedAt = timestamp;
    plugin.health = 'healthy';

    for (
      const capability
      of plugin.manifest.capabilities
    ) {
      const existing =
        this.capabilities.get(
          capability.key,
        );

      if (
        existing &&
        existing.pluginId !==
          plugin.manifest.id
      ) {
        throw new RuntimeValidationError(
          `Capability ${capability.key} is already provided by plugin ${existing.pluginKey}`,
        );
      }

      this.capabilities.set(
        capability.key,
        {
          id:
            existing?.id ??
            randomUUID(),
          capabilityKey:
            capability.key,
          capabilityName:
            capability.name,
          capabilityVersion:
            capability.version,
          pluginId:
            plugin.manifest.id,
          pluginKey:
            plugin.manifest.key,
          status: 'available',
          loadedAt:
            existing?.loadedAt ??
            timestamp,
        },
      );
    }

    this.recordLifecycleEvent(
      plugin,
      'loaded',
      previousStatus,
      plugin.status,
      {
        loadedCapabilities:
          plugin.manifest.capabilities.map(
            (capability) =>
              capability.key,
          ),
      },
    );

    return plugin;
  }

  startPlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    this.ensurePluginEnabled(plugin);

    if (
      plugin.status === 'registered' ||
      plugin.status === 'validated' ||
      plugin.status === 'unloaded'
    ) {
      this.loadPlugin(pluginId);
    }

    if (
      plugin.status !== 'loaded' &&
      plugin.status !== 'stopped'
    ) {
      throw new RuntimeLifecycleError(
        `Plugin ${plugin.manifest.key} cannot be started from status ${plugin.status}`,
      );
    }

    this.ensureRequiredDependenciesStarted(
      plugin,
    );

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.status = 'started';
    plugin.startedAt = timestamp;
    plugin.health = 'healthy';

    for (
      const capability
      of plugin.manifest.capabilities
    ) {
      const binding =
        this.capabilities.get(
          capability.key,
        );

      if (binding) {
        binding.status = 'active';
      }
    }

    this.recordLifecycleEvent(
      plugin,
      'started',
      previousStatus,
      plugin.status,
      {
        autoStart:
          plugin.manifest.autoStart,
      },
    );

    return plugin;
  }

  stopPlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    if (plugin.status !== 'started') {
      throw new RuntimeLifecycleError(
        `Only started plugins can be stopped`,
      );
    }

    this.ensureNoStartedDependents(
      plugin.manifest.key,
    );

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.status = 'stopped';
    plugin.stoppedAt = timestamp;
    plugin.health = 'unknown';

    for (
      const capability
      of plugin.manifest.capabilities
    ) {
      const binding =
        this.capabilities.get(
          capability.key,
        );

      if (binding) {
        binding.status = 'inactive';
      }
    }

    this.recordLifecycleEvent(
      plugin,
      'stopped',
      previousStatus,
      plugin.status,
      {},
    );

    return plugin;
  }

  disablePlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    if (plugin.status === 'started') {
      this.stopPlugin(pluginId);
    }

    this.ensureNoStartedDependents(
      plugin.manifest.key,
    );

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.manifest.enabled = false;
    plugin.manifest.updatedAt = timestamp;
    plugin.status = 'disabled';
    plugin.disabledAt = timestamp;
    plugin.health = 'unknown';

    for (
      const capability
      of plugin.manifest.capabilities
    ) {
      const binding =
        this.capabilities.get(
          capability.key,
        );

      if (binding) {
        binding.status = 'inactive';
      }
    }

    this.recordLifecycleEvent(
      plugin,
      'disabled',
      previousStatus,
      plugin.status,
      {},
    );

    return plugin;
  }

  enablePlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    if (
      plugin.status !== 'disabled'
    ) {
      throw new RuntimeLifecycleError(
        `Only disabled plugins can be enabled`,
      );
    }

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.manifest.enabled = true;
    plugin.manifest.updatedAt = timestamp;
    plugin.status = 'registered';
    plugin.health = 'unknown';

    delete plugin.disabledAt;

    this.recordLifecycleEvent(
      plugin,
      'enabled',
      previousStatus,
      plugin.status,
      {},
    );

    return plugin;
  }

  unloadPlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.requirePlugin(pluginId);

    if (plugin.status === 'started') {
      throw new RuntimeLifecycleError(
        `Started plugins must be stopped before unloading`,
      );
    }

    if (
      plugin.status !== 'loaded' &&
      plugin.status !== 'stopped' &&
      plugin.status !== 'validated'
    ) {
      throw new RuntimeLifecycleError(
        `Plugin ${plugin.manifest.key} cannot be unloaded from status ${plugin.status}`,
      );
    }

    this.ensureNoStartedDependents(
      plugin.manifest.key,
    );

    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.status = 'unloaded';
    plugin.unloadedAt = timestamp;
    plugin.health = 'unknown';

    for (
      const capability
      of plugin.manifest.capabilities
    ) {
      this.capabilities.delete(
        capability.key,
      );
    }

    this.recordLifecycleEvent(
      plugin,
      'unloaded',
      previousStatus,
      plugin.status,
      {},
    );

    return plugin;
  }

  bootstrap(): RuntimeBootstrapResult {
    const result: RuntimeBootstrapResult = {
      registered: this.plugins.size,
      validated: 0,
      loaded: 0,
      started: 0,
      failed: 0,
    };

    const pending = this.getPlugins()
      .filter(
        (plugin) =>
          plugin.manifest.enabled,
      );

    const processed =
      new Set<string>();

    let progress = true;

    while (
      processed.size < pending.length &&
      progress
    ) {
      progress = false;

      for (const plugin of pending) {
        if (
          processed.has(
            plugin.manifest.id,
          )
        ) {
          continue;
        }

        const dependenciesReady =
          plugin.manifest.dependencies
            .filter(
              (dependency) =>
                !dependency.optional,
            )
            .every((dependency) => {
              const dependencyPlugin =
                this.getPluginByKey(
                  dependency.pluginKey,
                );

              return (
                dependencyPlugin !== undefined &&
                (
                  dependencyPlugin.status ===
                    'started' ||
                  dependencyPlugin.status ===
                    'loaded'
                )
              );
            });

        if (
          !dependenciesReady &&
          plugin.manifest.dependencies
            .some(
              (dependency) =>
                !dependency.optional,
            )
        ) {
          continue;
        }

        try {
          this.validatePlugin(
            plugin.manifest.id,
          );

          result.validated += 1;

          this.loadPlugin(
            plugin.manifest.id,
          );

          result.loaded += 1;

          if (
            plugin.manifest.autoStart
          ) {
            this.startPlugin(
              plugin.manifest.id,
            );

            result.started += 1;
          }

          processed.add(
            plugin.manifest.id,
          );

          progress = true;
        } catch (error) {
          this.markPluginFailed(
            plugin,
            error,
          );

          result.failed += 1;

          processed.add(
            plugin.manifest.id,
          );

          progress = true;
        }
      }
    }

    for (const plugin of pending) {
      if (
        processed.has(
          plugin.manifest.id,
        )
      ) {
        continue;
      }

      this.markPluginFailed(
        plugin,
        new RuntimeDependencyError(
          `Plugin ${plugin.manifest.key} has unresolved dependencies`,
        ),
      );

      result.failed += 1;
    }

    return result;
  }

  getCapabilities(): CapabilityBinding[] {
    return Array.from(
      this.capabilities.values(),
    );
  }

  getCapability(
    capabilityKey: string,
  ): CapabilityBinding | undefined {
    return this.capabilities.get(
      capabilityKey
        .trim()
        .toLowerCase(),
    );
  }

  getLifecycleEvents(
    pluginId?: string,
  ): RuntimeLifecycleEvent[] {
    if (!pluginId) {
      return [...this.lifecycleEvents];
    }

    return this.lifecycleEvents.filter(
      (event) =>
        event.pluginId === pluginId,
    );
  }

  getHealth() {
    const plugins = this.getPlugins();

    const started =
      plugins.filter(
        (plugin) =>
          plugin.status === 'started',
      );

    const failed =
      plugins.filter(
        (plugin) =>
          plugin.status === 'failed',
      );

    const degraded =
      plugins.filter(
        (plugin) =>
          plugin.health === 'degraded',
      );

    const overall:
      | 'operational'
      | 'degraded'
      | 'unhealthy' =
      failed.length > 0
        ? 'unhealthy'
        : degraded.length > 0
          ? 'degraded'
          : 'operational';

    return {
      runtime: '@creatoros/runtime',
      version: this.runtimeVersion,
      status: overall,
      provider:
        'InMemoryRuntimeEngine',
      plugins: plugins.length,
      enabled: plugins.filter(
        (plugin) =>
          plugin.manifest.enabled,
      ).length,
      disabled: plugins.filter(
        (plugin) =>
          !plugin.manifest.enabled,
      ).length,
      registered: plugins.filter(
        (plugin) =>
          plugin.status ===
          'registered',
      ).length,
      validated: plugins.filter(
        (plugin) =>
          plugin.status ===
          'validated',
      ).length,
      loaded: plugins.filter(
        (plugin) =>
          plugin.status === 'loaded',
      ).length,
      started: started.length,
      stopped: plugins.filter(
        (plugin) =>
          plugin.status === 'stopped',
      ).length,
      failed: failed.length,
      capabilities:
        this.capabilities.size,
      activeCapabilities:
        this.getCapabilities().filter(
          (capability) =>
            capability.status ===
            'active',
        ).length,
      lifecycleEvents:
        this.lifecycleEvents.length,
    };
  }

  private requirePlugin(
    pluginId: string,
  ): RuntimePlugin {
    const plugin =
      this.plugins.get(pluginId);

    if (!plugin) {
      throw new RuntimePluginNotFoundError(
        pluginId,
      );
    }

    return plugin;
  }

  private ensurePluginEnabled(
    plugin: RuntimePlugin,
  ): void {
    if (
      !plugin.manifest.enabled ||
      plugin.status === 'disabled'
    ) {
      throw new RuntimeLifecycleError(
        `Plugin ${plugin.manifest.key} is disabled`,
      );
    }
  }

  private validateRuntimeCompatibility(
    plugin: RuntimePlugin,
  ): void {
    const compatibility =
      plugin.manifest
        .runtimeCompatibility
        .trim();

    const currentMajor =
      this.parseVersion(
        this.runtimeVersion,
      ).major;

    const requiredVersion =
      compatibility.replace(
        /^[\^~><=\s]+/,
        '',
      );

    const requiredMajor =
      this.parseVersion(
        requiredVersion,
      ).major;

    if (currentMajor !== requiredMajor) {
      throw new RuntimeCompatibilityError(
        `Plugin ${plugin.manifest.key} requires runtime ${compatibility}, current runtime is ${this.runtimeVersion}`,
      );
    }
  }

  private validateDependencies(
    plugin: RuntimePlugin,
  ): void {
    for (
      const dependency
      of plugin.manifest.dependencies
    ) {
      const dependencyPlugin =
        this.getPluginByKey(
          dependency.pluginKey,
        );

      if (!dependencyPlugin) {
        if (dependency.optional) {
          continue;
        }

        throw new RuntimeDependencyError(
          `Required plugin dependency ${dependency.pluginKey} is missing for ${plugin.manifest.key}`,
        );
      }

      if (
        !dependencyPlugin
          .manifest.enabled &&
        !dependency.optional
      ) {
        throw new RuntimeDependencyError(
          `Required plugin dependency ${dependency.pluginKey} is disabled`,
        );
      }

      if (
        dependency.minimumVersion &&
        !this.isVersionAtLeast(
          dependencyPlugin
            .manifest.version,
          dependency.minimumVersion,
        )
      ) {
        throw new RuntimeDependencyError(
          `Plugin ${dependency.pluginKey} must be at least version ${dependency.minimumVersion}`,
        );
      }
    }
  }

  private ensureRequiredDependenciesStarted(
    plugin: RuntimePlugin,
  ): void {
    for (
      const dependency
      of plugin.manifest.dependencies
    ) {
      if (dependency.optional) {
        continue;
      }

      const dependencyPlugin =
        this.getPluginByKey(
          dependency.pluginKey,
        );

      if (
        !dependencyPlugin ||
        dependencyPlugin.status !==
          'started'
      ) {
        throw new RuntimeDependencyError(
          `Required dependency ${dependency.pluginKey} must be started before ${plugin.manifest.key}`,
        );
      }
    }
  }

  private ensureNoStartedDependents(
    pluginKey: string,
  ): void {
    const dependent =
      this.getPlugins().find(
        (plugin) =>
          plugin.status === 'started' &&
          plugin.manifest.dependencies.some(
            (dependency) =>
              dependency.pluginKey ===
                pluginKey &&
              !dependency.optional,
          ),
      );

    if (dependent) {
      throw new RuntimeDependencyError(
        `Plugin ${pluginKey} is required by started plugin ${dependent.manifest.key}`,
      );
    }
  }

  private markPluginFailed(
    plugin: RuntimePlugin,
    error: unknown,
  ): void {
    const previousStatus = plugin.status;
    const timestamp = new Date().toISOString();

    plugin.status = 'failed';
    plugin.health = 'unhealthy';
    plugin.failedAt = timestamp;
    plugin.failureReason =
      error instanceof Error
        ? error.message
        : 'Unknown runtime failure';

    this.recordLifecycleEvent(
      plugin,
      'failed',
      previousStatus,
      plugin.status,
      {
        reason:
          plugin.failureReason,
      },
    );
  }

  private recordLifecycleEvent(
    plugin: RuntimePlugin,
    action:
      RuntimeLifecycleEvent['action'],
    previousStatus:
      | PluginLifecycleStatus
      | undefined,
    currentStatus:
      PluginLifecycleStatus,
    details: Record<string, unknown>,
  ): void {
    const event: RuntimeLifecycleEvent = {
      id: randomUUID(),
      pluginId:
        plugin.manifest.id,
      pluginKey:
        plugin.manifest.key,
      action,
      currentStatus,
      timestamp:
        new Date().toISOString(),
      details,
    };

    if (previousStatus !== undefined) {
      event.previousStatus =
        previousStatus;
    }

    this.lifecycleEvents.push(event);
  }

  private parseVersion(
    version: string,
  ): RuntimeVersion {
    const normalized =
      version.trim().replace(
        /^[vV]/,
        '',
      );

    const parts =
      normalized.split('.');

    const major =
      Number(parts[0] ?? 0);

    const minor =
      Number(parts[1] ?? 0);

    const patch =
      Number(parts[2] ?? 0);

    if (
      Number.isNaN(major) ||
      Number.isNaN(minor) ||
      Number.isNaN(patch)
    ) {
      throw new RuntimeValidationError(
        `Invalid semantic version ${version}`,
      );
    }

    return {
      major,
      minor,
      patch,
    };
  }

  private isVersionAtLeast(
    currentVersion: string,
    minimumVersion: string,
  ): boolean {
    const current =
      this.parseVersion(
        currentVersion,
      );

    const minimum =
      this.parseVersion(
        minimumVersion,
      );

    if (
      current.major !== minimum.major
    ) {
      return (
        current.major >
        minimum.major
      );
    }

    if (
      current.minor !== minimum.minor
    ) {
      return (
        current.minor >
        minimum.minor
      );
    }

    return (
      current.patch >=
      minimum.patch
    );
  }
}
