import type {
  InstalledPluginContract,
  PluginHostOperationResult,
} from '../../plugin-host';

export interface PluginLifecycleListResult {
  readonly count: number;
  readonly total: number;
  readonly plugins:
    readonly InstalledPluginContract[];
}

export interface PluginLifecycleMetrics {
  readonly totalPlugins: number;
  readonly activePlugins: number;
  readonly inactivePlugins: number;
  readonly installedPlugins: number;
  readonly failedPlugins: number;
  readonly pluginsWithRuntime: number;
  readonly states:
    Readonly<Record<string, number>>;
  readonly generatedAt: string;
}

export interface BulkPluginLifecycleItemResult {
  readonly pluginKey: string;
  readonly successful: boolean;
  readonly result?:
    PluginHostOperationResult;
  readonly error?: string;
}

export interface BulkPluginLifecycleResult {
  readonly operation:
    | 'activate'
    | 'deactivate'
    | 'uninstall';
  readonly requested: number;
  readonly processed: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly results:
    readonly BulkPluginLifecycleItemResult[];
  readonly completedAt: string;
}