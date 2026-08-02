import {
  Injectable,
} from "@nestjs/common";

import {
  AiStudioRuntimeRegistryService,
} from "../ai-studio-runtime/ai-studio-runtime-registry.service";

import type {
  RuntimeDispatchProvider,
  RuntimeProviderAvailability,
  RuntimeProviderQuery,
} from "./runtime-provider.contracts";

type UnknownRecord = Record<string, unknown>;

@Injectable()
export class RuntimeProviderRegistryService {
  constructor(
    private readonly runtimeRegistry:
      AiStudioRuntimeRegistryService,
  ) {}

  async discover(
    query: RuntimeProviderQuery = {},
  ): Promise<RuntimeDispatchProvider[]> {
    const rawProviders =
      await this.readRuntimeProviders();

    return rawProviders
      .map((provider) =>
        this.normalizeProvider(provider),
      )
      .filter((provider) =>
        this.matches(provider, query),
      )
      .sort((left, right) => {
        if (left.available !== right.available) {
          return left.available ? -1 : 1;
        }

        if (left.health !== right.health) {
          return right.health - left.health;
        }

        if (left.workload !== right.workload) {
          return left.workload - right.workload;
        }

        return right.priority - left.priority;
      });
  }

  async getById(
    providerId: string,
  ): Promise<RuntimeDispatchProvider | null> {
    const providers = await this.discover({
      providerId,
    });

    return providers[0] ?? null;
  }

  private async readRuntimeProviders():
    Promise<UnknownRecord[]> {
    const registry =
      this.runtimeRegistry as unknown as
        Record<string, unknown>;

    const candidateMethods = [
      "getProviders",
      "listProviders",
      "findAll",
      "getAll",
      "getRegistry",
      "getCollection",
      "snapshot",
    ];

    for (const methodName of candidateMethods) {
      const candidate = registry[methodName];

      if (typeof candidate !== "function") {
        continue;
      }

      const result = await Promise.resolve(
        candidate.call(this.runtimeRegistry),
      );

      const collection =
        this.extractCollection(result);

      if (collection.length > 0) {
        return collection;
      }
    }

    const candidateProperties = [
      "providers",
      "registry",
      "items",
      "collection",
    ];

    for (const propertyName of candidateProperties) {
      const collection =
        this.extractCollection(
          registry[propertyName],
        );

      if (collection.length > 0) {
        return collection;
      }
    }

    return [];
  }

  private extractCollection(
    value: unknown,
  ): UnknownRecord[] {
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is UnknownRecord =>
          this.isRecord(item),
      );
    }

    if (!this.isRecord(value)) {
      return [];
    }

    const nestedCandidates = [
      value.providers,
      value.items,
      value.data,
      value.results,
      value.collection,
    ];

    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) {
        return candidate.filter(
          (item): item is UnknownRecord =>
            this.isRecord(item),
        );
      }

      if (candidate instanceof Map) {
        return Array.from(
          candidate.values(),
        ).filter(
          (item): item is UnknownRecord =>
            this.isRecord(item),
        );
      }

      if (this.isRecord(candidate)) {
        return Object.values(candidate).filter(
          (item): item is UnknownRecord =>
            this.isRecord(item),
        );
      }
    }

    return Object.values(value).filter(
      (item): item is UnknownRecord =>
        this.isRecord(item),
    );
  }

  private normalizeProvider(
    raw: UnknownRecord,
  ): RuntimeDispatchProvider {
    const capability =
      this.stringValue(
        raw.capability,
        raw.type,
        raw.category,
      ) || "unknown";

    const moduleName =
      this.stringValue(
        raw.module,
        raw.moduleName,
        raw.sourceModule,
      ) || "unknown";

    const name =
      this.stringValue(
        raw.name,
        raw.providerName,
        raw.className,
        raw.displayName,
      ) || "RuntimeProvider";

    const id =
      this.stringValue(
        raw.id,
        raw.providerId,
        raw.key,
      ) || `${moduleName}:${name}`;

    const scope =
      this.stringValue(
        raw.scope,
        raw.lifecycle,
      ) || "default";

    const availability =
      this.normalizeAvailability(raw);

    const available =
      this.booleanValue(
        raw.available,
        raw.isAvailable,
      ) ??
      (
        availability === "available" ||
        availability === "unknown"
      );

    return {
      id,
      name,
      module: moduleName,
      capability,
      scope,
      available,
      availability:
        available &&
        availability === "unknown"
          ? "available"
          : availability,
      health: this.numberValue(
        raw.health,
        raw.healthScore,
        raw.healthPercent,
        100,
      ),
      priority: this.numberValue(
        raw.priority,
        raw.weight,
        0,
      ),
      workload: this.numberValue(
        raw.workload,
        raw.load,
        raw.utilization,
        0,
      ),
      metadata:
        this.isRecord(raw.metadata)
          ? raw.metadata
          : {},
      raw,
    };
  }

  private matches(
    provider: RuntimeDispatchProvider,
    query: RuntimeProviderQuery,
  ): boolean {
    if (
      query.providerId &&
      provider.id !== query.providerId
    ) {
      return false;
    }

    if (
      query.capability &&
      provider.capability.toLowerCase() !==
        query.capability.toLowerCase()
    ) {
      return false;
    }

    if (
      query.scope &&
      provider.scope.toLowerCase() !==
        query.scope.toLowerCase()
    ) {
      return false;
    }

    if (
      query.onlyAvailable &&
      !provider.available
    ) {
      return false;
    }

    if (
      query.minimumHealth !== undefined &&
      provider.health < query.minimumHealth
    ) {
      return false;
    }

    if (
      query.maximumWorkload !== undefined &&
      provider.workload > query.maximumWorkload
    ) {
      return false;
    }

    return true;
  }

  private normalizeAvailability(
    raw: UnknownRecord,
  ): RuntimeProviderAvailability {
    const value =
      this.stringValue(
        raw.availability,
        raw.status,
        raw.state,
      ).toLowerCase();

    if (
      value === "available" ||
      value === "ready" ||
      value === "online" ||
      value === "operational" ||
      value === "active"
    ) {
      return "available";
    }

    if (
      value === "busy" ||
      value === "running" ||
      value === "occupied"
    ) {
      return "busy";
    }

    if (
      value === "degraded" ||
      value === "warning"
    ) {
      return "degraded";
    }

    if (
      value === "offline" ||
      value === "failed" ||
      value === "error" ||
      value === "unavailable"
    ) {
      return "offline";
    }

    return "unknown";
  }

  private stringValue(
    ...values: unknown[]
  ): string {
    for (const value of values) {
      if (
        typeof value === "string" &&
        value.trim()
      ) {
        return value.trim();
      }
    }

    return "";
  }

  private numberValue(
    ...values: unknown[]
  ): number {
    for (const value of values) {
      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return Math.max(
          0,
          Math.min(100, value),
        );
      }

      if (
        typeof value === "string" &&
        value.trim() &&
        Number.isFinite(Number(value))
      ) {
        return Math.max(
          0,
          Math.min(100, Number(value)),
        );
      }
    }

    return 0;
  }

  private booleanValue(
    ...values: unknown[]
  ): boolean | null {
    for (const value of values) {
      if (typeof value === "boolean") {
        return value;
      }
    }

    return null;
  }

  private isRecord(
    value: unknown,
  ): value is UnknownRecord {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    );
  }
}