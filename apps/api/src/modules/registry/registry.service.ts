import { Injectable } from '@nestjs/common';
import {
  CapabilityService,
} from '../capabilities/capability.service';
import {
  DependencyService,
} from '../dependencies/dependency.service';
import {
  DomainService,
} from '../domains/domain.service';

@Injectable()
export class RegistryService {
  constructor(
    private readonly domainService:
      DomainService,
    private readonly capabilityService:
      CapabilityService,
    private readonly dependencyService:
      DependencyService,
  ) {}

  async getSummary() {
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
      registry: 'creatoros-registry',
      name: 'CreatorOS Registry',
      version: '2.0.0',
      status: 'operational',
      counts: {
        domains: domains.count,
        capabilities:
          capabilities.count,
        dependencies:
          dependencies.count,
      },
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
      providers: {
        domains: 'in-memory',
        capabilities:
          'PostgreSQL/Prisma',
        dependencies: 'in-memory',
      },
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
    };
  }

  async getStatus() {
    return this.getSummary();
  }
}