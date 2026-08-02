import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type {
  RuntimeDispatchDecision,
  RuntimeDispatchProvider,
  RuntimeDispatchRequest,
  RuntimeDispatcherOverview,
  RuntimeProviderSelection,
} from "./runtime-provider.contracts";

import {
  RuntimeProviderRegistryService,
} from "./runtime-provider-registry.service";

@Injectable()
export class RuntimeDispatcherService {
  constructor(
    private readonly registry:
      RuntimeProviderRegistryService,
  ) {}

  async listProviders(
    capability?: string,
  ): Promise<RuntimeDispatchProvider[]> {
    return this.registry.discover({
      capability,
    });
  }

  async getOverview():
    Promise<RuntimeDispatcherOverview> {
    const providers =
      await this.registry.discover();

    const capabilities =
      providers.reduce<Record<string, number>>(
        (result, provider) => {
          result[provider.capability] =
            (result[provider.capability] ?? 0) +
            1;

          return result;
        },
        {},
      );

    const averageHealth =
      providers.length === 0
        ? 0
        : Math.round(
            providers.reduce(
              (total, provider) =>
                total + provider.health,
              0,
            ) / providers.length,
          );

    const averageWorkload =
      providers.length === 0
        ? 0
        : Math.round(
            providers.reduce(
              (total, provider) =>
                total + provider.workload,
              0,
            ) / providers.length,
          );

    return {
      providers: providers.length,
      available: providers.filter(
        (provider) =>
          provider.availability ===
          "available",
      ).length,
      busy: providers.filter(
        (provider) =>
          provider.availability === "busy",
      ).length,
      degraded: providers.filter(
        (provider) =>
          provider.availability ===
          "degraded",
      ).length,
      offline: providers.filter(
        (provider) =>
          provider.availability ===
          "offline",
      ).length,
      capabilities,
      averageHealth,
      averageWorkload,
    };
  }

  async selectProvider(
    request: RuntimeDispatchRequest,
  ): Promise<RuntimeDispatchDecision> {
    const providers =
      await this.registry.discover({
        capability: request.capability,
        scope: request.scope,
        onlyAvailable: true,
        minimumHealth:
          request.minimumHealth ?? 50,
        maximumWorkload:
          request.maximumWorkload ?? 90,
      });

    if (providers.length === 0) {
      throw new NotFoundException({
        message:
          "No compatible Runtime provider is currently available.",
        capability: request.capability,
        scope: request.scope ?? null,
      });
    }

    const selections = providers
      .map((provider) =>
        this.scoreProvider(
          provider,
          request,
        ),
      )
      .sort(
        (left, right) =>
          right.score - left.score,
      );

    return {
      selected: selections[0]!,
      alternatives: selections.slice(1, 6),
      requestedCapability:
        request.capability,
      generatedAt: new Date().toISOString(),
    };
  }

  private scoreProvider(
    provider: RuntimeDispatchProvider,
    request: RuntimeDispatchRequest,
  ): RuntimeProviderSelection {
    let score = 0;
    const reasons: string[] = [];

    score += provider.health * 0.45;
    reasons.push(
      `health:${provider.health}`,
    );

    const workloadScore =
      100 - provider.workload;

    score += workloadScore * 0.3;
    reasons.push(
      `workload:${provider.workload}`,
    );

    score += provider.priority * 0.15;

    if (provider.priority > 0) {
      reasons.push(
        `priority:${provider.priority}`,
      );
    }

    if (
      request.preferredProviderId ===
      provider.id
    ) {
      score += 25;
      reasons.push("preferred-provider");
    }

    if (
      request.scope &&
      request.scope === provider.scope
    ) {
      score += 10;
      reasons.push("scope-match");
    }

    if (provider.available) {
      score += 10;
      reasons.push("available");
    }

    return {
      provider,
      score: Math.round(score * 100) / 100,
      reasons,
    };
  }
}