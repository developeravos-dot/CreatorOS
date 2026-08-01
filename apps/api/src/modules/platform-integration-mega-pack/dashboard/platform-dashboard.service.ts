import { Injectable } from '@nestjs/common';
import { CreatorOSPlatform } from '../platform-integration.types';

@Injectable()
export class PlatformDashboardService {
  build(platform: CreatorOSPlatform) {
    const enabled = platform.capabilities.filter(
      (item) => item.enabled,
    );

    const overallHealth =
      enabled.length === 0
        ? 0
        : Math.round(
            enabled.reduce(
              (sum, item) =>
                sum + item.healthScore,
              0,
            ) / enabled.length,
          );

    return {
      platformId: platform.id,
      name: platform.name,
      version: platform.version,
      status: platform.status,
      overallHealth,
      totals: {
        capabilities:
          platform.capabilities.length,
        enabledCapabilities:
          enabled.length,
        healthyCapabilities:
          platform.capabilities.filter(
            (item) =>
              item.status === 'healthy' ||
              item.status === 'registered',
          ).length,
        warningCapabilities:
          platform.capabilities.filter(
            (item) =>
              item.status === 'warning',
          ).length,
        criticalCapabilities:
          platform.capabilities.filter(
            (item) =>
              item.status === 'critical',
          ).length,
        offlineCapabilities:
          platform.capabilities.filter(
            (item) =>
              item.status === 'offline',
          ).length,
        commands: platform.commands.length,
        pendingApprovals:
          platform.commands.filter(
            (item) =>
              item.status ===
              'awaiting-human-approval',
          ).length,
        events: platform.events.length,
      },
      capabilities:
        platform.capabilities.map(
          (item) => ({
            key: item.key,
            name: item.name,
            domain: item.domain,
            status: item.status,
            healthScore: item.healthScore,
            apiRoot: item.apiRoot,
            enabled: item.enabled,
          }),
        ),
    };
  }
}