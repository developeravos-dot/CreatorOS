import { Module } from '@nestjs/common';
import { CapabilityModule } from '../capabilities/capability.module';
import { DependencyModule } from '../dependencies/dependency.module';
import { DomainModule } from '../domains/domain.module';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';

@Module({
  imports: [
    CapabilityModule,
    DomainModule,
    DependencyModule,
  ],
  controllers: [RegistryController],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
