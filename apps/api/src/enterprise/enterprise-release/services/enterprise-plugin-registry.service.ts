import {
  Injectable,
} from '@nestjs/common';

export interface EnterprisePluginManifest {
  readonly pluginId: string;
  readonly version: string;
  readonly displayName: string;
  readonly permissions:
    readonly string[];
  readonly entrypoint: string;
  readonly enabled: boolean;
}

@Injectable()
export class EnterprisePluginRegistryService {
  private readonly plugins =
    new Map<
      string,
      EnterprisePluginManifest[]
    >();

  register(
    manifest:
      EnterprisePluginManifest,
  ): EnterprisePluginManifest {
    const pluginId =
      manifest.pluginId.trim();

    const version =
      manifest.version.trim();

    if (
      !pluginId ||
      !version ||
      !manifest.displayName.trim() ||
      !manifest.entrypoint.trim()
    ) {
      throw new Error(
        'Valid plugin manifest is required.',
      );
    }

    const versions =
      this.plugins.get(
        pluginId,
      ) ?? [];

    if (
      versions.some(
        (plugin) =>
          plugin.version ===
          version,
      )
    ) {
      throw new Error(
        'Plugin version already exists.',
      );
    }

    const normalized = {
      ...manifest,
      pluginId,
      version,
      displayName:
        manifest.displayName.trim(),
      entrypoint:
        manifest.entrypoint.trim(),
      permissions: [
        ...new Set(
          manifest.permissions
            .map(
              (permission) =>
                permission.trim(),
            )
            .filter(Boolean),
        ),
      ],
    };

    this.plugins.set(
      pluginId,
      [...versions, normalized],
    );

    return this.clone(
      normalized,
    );
  }

  resolve(
    pluginId: string,
  ): EnterprisePluginManifest {
    const versions =
      this.plugins.get(
        pluginId.trim(),
      ) ?? [];

    const selected =
      [...versions]
        .filter(
          (plugin) =>
            plugin.enabled,
        )
        .sort(
          (left, right) =>
            right.version.localeCompare(
              left.version,
              undefined,
              { numeric: true },
            ),
        )[0];

    if (!selected) {
      throw new Error(
        'No enabled plugin version was found.',
      );
    }

    return this.clone(selected);
  }

  list():
    readonly EnterprisePluginManifest[] {
    return [...this.plugins.values()]
      .flat()
      .map((plugin) =>
        this.clone(plugin),
      );
  }

  private clone(
    plugin:
      EnterprisePluginManifest,
  ): EnterprisePluginManifest {
    return {
      ...plugin,
      permissions: [
        ...plugin.permissions,
      ],
    };
  }
}
