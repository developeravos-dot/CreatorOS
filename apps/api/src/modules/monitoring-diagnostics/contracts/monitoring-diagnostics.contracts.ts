export type ComponentHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'unknown';

export type MonitoringSeverity =
  | 'info'
  | 'warning'
  | 'critical';

export interface ComponentHealthResult {
  readonly component: string;
  readonly status:
    ComponentHealthStatus;
  readonly message: string;
  readonly latencyMs: number;
  readonly checkedAt: string;
  readonly details:
    Readonly<Record<string, unknown>>;
}

export interface ComponentHealthCheckOptions {
  readonly component: string;
  readonly timeoutMs?: number;
  readonly timeoutStatus?:
    ComponentHealthStatus;
  readonly timeoutMessage?: string;
}

export interface ComponentHealthProbeResult {
  readonly status:
    ComponentHealthStatus;
  readonly message: string;
  readonly details?:
    Readonly<Record<string, unknown>>;
}

export interface SystemLivenessResult {
  readonly alive: boolean;
  readonly status:
    ComponentHealthStatus;
  readonly uptimeSeconds: number;
  readonly responsivenessMs: number;
  readonly checkedAt: string;
}

export interface SystemReadinessResult {
  readonly ready: boolean;
  readonly status:
    ComponentHealthStatus;
  readonly components:
    readonly ComponentHealthResult[];
  readonly checkedAt: string;
}

export interface ComponentHealthCounts {
  readonly healthy: number;
  readonly degraded: number;
  readonly unhealthy: number;
  readonly unknown: number;
}

export interface SystemHealthSummary {
  readonly status:
    ComponentHealthStatus;
  readonly uptimeSeconds: number;
  readonly startedAt: string;
  readonly checkedAt: string;
  readonly nodeVersion: string;
  readonly processId: number;
  readonly environment?: string;
  readonly counts:
    ComponentHealthCounts;
  readonly components:
    readonly ComponentHealthResult[];
}

export interface MonitoringIssue {
  readonly code: string;
  readonly severity:
    MonitoringSeverity;
  readonly component: string;
  readonly message: string;
  readonly evidence:
    Readonly<Record<string, unknown>>;
  readonly detectedAt: string;
}

export interface MonitoringRecommendation {
  readonly code: string;
  readonly severity:
    MonitoringSeverity;
  readonly component: string;
  readonly action: string;
  readonly reason: string;
}

export interface DiagnosticsSummary {
  readonly status:
    ComponentHealthStatus;
  readonly issues:
    readonly MonitoringIssue[];
  readonly recommendations:
    readonly MonitoringRecommendation[];
  readonly generatedAt: string;
}

export interface ProcessMemoryMetrics {
  readonly rssBytes: number;
  readonly heapTotalBytes: number;
  readonly heapUsedBytes: number;
  readonly externalBytes: number;
  readonly arrayBuffersBytes: number;
}

export interface ProcessCpuMetrics {
  readonly userMicroseconds: number;
  readonly systemMicroseconds: number;
}

export interface ProcessMetrics {
  readonly processId: number;
  readonly nodeVersion: string;
  readonly platform: NodeJS.Platform;
  readonly architecture: string;
  readonly uptimeSeconds: number;
  readonly startedAt: string;
  readonly responsivenessMs: number;
  readonly memory:
    ProcessMemoryMetrics;
  readonly cpu:
    ProcessCpuMetrics;
  readonly generatedAt: string;
}

export interface DatabaseHealthMetrics {
  readonly status:
    ComponentHealthStatus;
  readonly healthy: boolean;
  readonly latencyMs: number;
}

export interface CapabilityRegistryMetrics {
  readonly total: number;
  readonly valid: number;
  readonly invalid: number;
  readonly states:
    Readonly<Record<string, number>>;
}

export interface CapabilityRuntimeMetrics {
  readonly total: number;
  readonly running: number;
  readonly stopped: number;
  readonly failed: number;
  readonly transitional: number;
  readonly states:
    Readonly<Record<string, number>>;
}

export interface DependencyResolverMetrics {
  readonly available: boolean;
  readonly stateless: boolean;
  readonly message: string;
}

export interface PluginHostMetrics {
  readonly total: number;
  readonly active: number;
  readonly inactive: number;
  readonly installed: number;
  readonly failed: number;
  readonly transitional: number;
  readonly withRuntimeInstance: number;
  readonly states:
    Readonly<Record<string, number>>;
}

export interface SystemMetricsSummary {
  readonly process:
    ProcessMetrics;
  readonly database?:
    DatabaseHealthMetrics;
  readonly registry?:
    CapabilityRegistryMetrics;
  readonly runtime?:
    CapabilityRuntimeMetrics;
  readonly dependencyResolver?:
    DependencyResolverMetrics;
  readonly pluginHost?:
    PluginHostMetrics;
  readonly generatedAt: string;
}