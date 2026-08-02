import { Injectable, Logger } from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";
import type {
  AiStudioRuntimeCapability,
  AiStudioRuntimeCollection,
  AiStudioRuntimeOverview,
  AiStudioRuntimeProvider,
} from "./ai-studio-runtime.contracts";

interface ProviderWrapperLike {
  name?: unknown;
  token?: unknown;
  metatype?: {
    name?: unknown;
  } | null;
  instance?: {
    constructor?: {
      name?: unknown;
    };
  } | null;
  host?: {
    name?: unknown;
    metatype?: {
      name?: unknown;
    } | null;
  } | null;
  scope?: unknown;
}

const capabilityPatterns: Array<{
  capability: AiStudioRuntimeCapability;
  pattern: RegExp;
}> = [
  {
    capability: "approval",
    pattern: /approval|human.?authority|review.?gate/i,
  },
  {
    capability: "workflow",
    pattern: /workflow|pipeline|orchestrat/i,
  },
  {
    capability: "execution",
    pattern: /execution|runner|runtime|executor/i,
  },
  {
    capability: "memory",
    pattern: /memory|knowledge|context|retriev/i,
  },
  {
    capability: "model",
    pattern: /model|llm|openai|gemini|claude|router/i,
  },
  {
    capability: "tool",
    pattern: /tool|plugin|capability|connector/i,
  },
  {
    capability: "queue",
    pattern: /queue|job|scheduler|background/i,
  },
  {
    capability: "task",
    pattern: /task|command/i,
  },
  {
    capability: "logging",
    pattern: /log|audit|telemetry|monitor/i,
  },
  {
    capability: "agent",
    pattern: /agent|organization/i,
  },
];

@Injectable()
export class AiStudioRuntimeRegistryService {
  private readonly logger = new Logger(
    AiStudioRuntimeRegistryService.name,
  );

  constructor(
    private readonly discoveryService: DiscoveryService,
  ) {}

  getOverview(): AiStudioRuntimeOverview {
    const providerCollection = this.getProviders();
    const capabilities = this.createEmptyCapabilityMap();

    for (const provider of providerCollection.items) {
      capabilities[provider.capability] += 1;
    }

    const populatedCapabilities = Object.values(capabilities).filter(
      (count) => count > 0,
    ).length;

    const totalCapabilities = Object.keys(capabilities).length;

    const health =
      totalCapabilities === 0
        ? 0
        : Math.round(
            (populatedCapabilities / totalCapabilities) * 100,
          );

    return {
      status: health >= 60 ? "operational" : "degraded",
      generatedAt: new Date().toISOString(),
      providers: providerCollection.total,
      capabilities,
      health,
    };
  }

  getProviders(
    capability?: AiStudioRuntimeCapability,
  ): AiStudioRuntimeCollection<AiStudioRuntimeProvider> {
    const items = this.discoverProviders().filter(
      (provider) =>
        capability === undefined ||
        provider.capability === capability,
    );

    return {
      source: "creatoros-runtime",
      generatedAt: new Date().toISOString(),
      total: items.length,
      items,
    };
  }

  getAgents() {
    return this.getProviders("agent");
  }

  getTasks() {
    return this.getProviders("task");
  }

  getWorkflows() {
    return this.getProviders("workflow");
  }

  getApprovals() {
    return this.getProviders("approval");
  }

  getMemoryProviders() {
    return this.getProviders("memory");
  }

  getModels() {
    return this.getProviders("model");
  }

  getExecutions() {
    return this.getProviders("execution");
  }

  getTools() {
    return this.getProviders("tool");
  }

  getQueues() {
    return this.getProviders("queue");
  }

  getLogs() {
    return this.getProviders("logging");
  }

  getProviderById(
    providerId: string,
  ): AiStudioRuntimeProvider | null {
    return (
      this.discoverProviders().find(
        (provider) => provider.id === providerId,
      ) ?? null
    );
  }

  private discoverProviders(): AiStudioRuntimeProvider[] {
    let discovered: unknown[] = [];

    try {
      discovered = this.discoveryService.getProviders() as unknown[];
    } catch (error) {
      this.logger.error(
        "Unable to read Nest runtime providers.",
        this.getErrorStack(error),
      );

      return [];
    }

    const result = new Map<string, AiStudioRuntimeProvider>();
    let skippedProviders = 0;

    for (const discoveredWrapper of discovered) {
      try {
        const wrapper =
          discoveredWrapper as ProviderWrapperLike;

        const name = this.resolveProviderName(wrapper);

        if (!name) {
          skippedProviders += 1;
          continue;
        }

        const capability = this.detectCapability(name);

        if (!capability) {
          continue;
        }

        const moduleName = this.resolveModuleName(wrapper);
        const id = `${moduleName}:${name}`;

        result.set(id, {
          id,
          name,
          capability,
          module: moduleName,
          available: this.isProviderAvailable(wrapper),
          scope: this.safeString(wrapper.scope, "default"),
        });
      } catch (error) {
        skippedProviders += 1;

        this.logger.warn(
          `Skipped one unreadable runtime provider: ${this.getErrorMessage(
            error,
          )}`,
        );
      }
    }

    const providers = [...result.values()].sort(
      (left, right) =>
        left.name.localeCompare(right.name, "en", {
          sensitivity: "base",
        }),
    );

    this.logger.debug(
      [
        `Discovered ${providers.length} AI runtime providers.`,
        `Skipped ${skippedProviders} unreadable providers.`,
      ].join(" "),
    );

    return providers;
  }

  private resolveProviderName(
    wrapper: ProviderWrapperLike,
  ): string | null {
    const candidates: unknown[] = [
      wrapper.name,
      wrapper.metatype?.name,
      wrapper.instance?.constructor?.name,
      wrapper.token,
    ];

    for (const candidate of candidates) {
      const normalized = this.normalizeToken(candidate);

      if (normalized) {
        return normalized;
      }
    }

    return null;
  }

  private resolveModuleName(
    wrapper: ProviderWrapperLike,
  ): string {
    return (
      this.normalizeToken(wrapper.host?.name) ??
      this.normalizeToken(wrapper.host?.metatype?.name) ??
      "UnknownModule"
    );
  }

  private normalizeToken(value: unknown): string | null {
    if (typeof value === "string") {
      const normalized = value.trim();

      return normalized.length > 0 ? normalized : null;
    }

    if (typeof value === "symbol") {
      const description = value.description?.trim();

      return description
        ? `Symbol(${description})`
        : value.toString();
    }

    if (typeof value === "function") {
      const functionName = value.name?.trim();

      return functionName || null;
    }

    if (
      typeof value === "number" ||
      typeof value === "bigint" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    return null;
  }

  private isProviderAvailable(
    wrapper: ProviderWrapperLike,
  ): boolean {
    try {
      return Boolean(
        wrapper.instance ??
          wrapper.metatype ??
          wrapper.token ??
          wrapper.name,
      );
    } catch {
      return false;
    }
  }

  private detectCapability(
    providerName: string,
  ): AiStudioRuntimeCapability | null {
    return (
      capabilityPatterns.find(({ pattern }) =>
        pattern.test(providerName),
      )?.capability ?? null
    );
  }

  private safeString(
    value: unknown,
    fallback: string,
  ): string {
    try {
      if (value === undefined || value === null) {
        return fallback;
      }

      return String(value);
    } catch {
      return fallback;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return this.safeString(error, "Unknown error");
  }

  private getErrorStack(error: unknown): string | undefined {
    return error instanceof Error ? error.stack : undefined;
  }

  private createEmptyCapabilityMap(): Record<
    AiStudioRuntimeCapability,
    number
  > {
    return {
      agent: 0,
      task: 0,
      workflow: 0,
      approval: 0,
      memory: 0,
      model: 0,
      execution: 0,
      tool: 0,
      queue: 0,
      logging: 0,
    };
  }
}

