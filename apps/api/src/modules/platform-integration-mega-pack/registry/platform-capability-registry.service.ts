import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlatformCapability } from '../platform-integration.types';

@Injectable()
export class PlatformCapabilityRegistryService {
  defaults(): PlatformCapability[] {
    return [
      this.create(
        'platform',
        'CreatorOS Platform',
        'Platform',
        '/platform',
      ),
      this.create(
        'media',
        'CreatorOS Media',
        'Media',
        '/media',
      ),
      this.create(
        'knowledge',
        'CreatorOS Knowledge',
        'Knowledge',
        '/knowledge',
      ),
      this.create(
        'live',
        'CreatorOS Live',
        'Live Experiences',
        '/live',
      ),
      this.create(
        'organization',
        'CreatorOS Organization',
        'Organization',
        '/media/organization-automation',
      ),
      this.create(
        'command-center',
        'CreatorOS Command Center',
        'Platform Operations',
        '/media/command-center',
      ),
    ];
  }

  create(
    key: string,
    name: string,
    domain: string,
    apiRoot: string,
  ): PlatformCapability {
    return {
      id: randomUUID(),
      key,
      name,
      domain,
      version: '1.0.0',
      status: 'registered',
      apiRoot,
      dependencies: [],
      healthScore: 100,
      enabled: true,
      metadata: {},
    };
  }

  register(
    capabilities: PlatformCapability[],
    capability: PlatformCapability,
  ) {
    if (
      capabilities.some(
        (item) => item.key === capability.key,
      )
    ) {
      throw new Error(
        `Capability already registered: ${capability.key}`,
      );
    }

    capabilities.push(capability);
    return capability;
  }

  updateHealth(
    capability: PlatformCapability,
    score: number,
  ) {
    capability.healthScore = Math.max(
      0,
      Math.min(100, score),
    );

    capability.status =
      capability.healthScore >= 85
        ? 'healthy'
        : capability.healthScore >= 65
          ? 'warning'
          : capability.healthScore > 0
            ? 'critical'
            : 'offline';

    return capability;
  }
}