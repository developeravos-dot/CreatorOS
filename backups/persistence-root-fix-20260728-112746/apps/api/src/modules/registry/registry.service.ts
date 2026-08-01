import { Injectable } from '@nestjs/common';
import { CapabilityService } from '../capabilities/capability.service';
import { DependencyService } from '../dependencies/dependency.service';
import { DomainService } from '../domains/domain.service';

@Injectable()
export class RegistryService {
  constructor(
    private readonly domainService: DomainService,
    private readonly capabilityService: CapabilityService,
    private readonly dependencyService: DependencyService,
  ) {}

  async getStatus() {
    const [
      domains,
      capabilities,
      dependencies,
    ] = await Promise.all([
      Promise.resolve(
        this.domainService.getAll(),
      ),
      this.capabilityService.getAll(),
      Promise.resolve(
        this.dependencyService.getAll(),
      ),
    ]);

    return {
      name: 'CreatorOS Registry',
      version: '1.1.0',
      status: 'operational',
      registries: {
        domains: domains.count,
        capabilities:
          capabilities.count,
        dependencies:
          dependencies.count,
      },
      health: {
        domainRegistry:
          domains.status,
        capabilityRegistry:
          capabilities.status,
        dependencyRegistry:
          dependencies.status,
      },
      provider: {
        domains: 'in-memory',
        capabilities:
          'PostgreSQL/Prisma',
        dependencies: 'in-memory',
      },
    };
  }
}