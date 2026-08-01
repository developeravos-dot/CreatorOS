import { Injectable } from '@nestjs/common';
import { CapabilityService } from '../capabilities/capability.service';
import { DependencyService } from '../dependencies/dependency.service';
import { DomainService } from '../domains/domain.service';

@Injectable()
export class RegistryService {
  constructor(
    private readonly capabilityService: CapabilityService,
    private readonly domainService: DomainService,
    private readonly dependencyService: DependencyService,
  ) {}

  getSummary() {
    const capabilities = this.capabilityService.getAll();
    const domains = this.domainService.getAll();
    const dependencies = this.dependencyService.getAll();

    return {
      registry: 'system-registry',
      status: 'operational',
      domains: domains.count,
      capabilities: capabilities.count,
      dependencies: dependencies.count,
      sources: {
        domainRegistry: domains.status,
        capabilityRegistry: capabilities.status,
        dependencyRegistry: dependencies.status,
      },
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
      },
    };
  }
}
