import { Global, Module } from '@nestjs/common';
import { IntegrationRegistryController } from './integration-registry.controller';
import { IntegrationRegistryService } from './integration-registry.service';

@Global()
@Module({
  controllers: [IntegrationRegistryController],
  providers: [IntegrationRegistryService],
  exports: [IntegrationRegistryService],
})
export class CreatorOsIntegrationLayerModule {}