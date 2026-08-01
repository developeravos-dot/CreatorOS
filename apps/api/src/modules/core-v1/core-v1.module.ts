import { Module } from '@nestjs/common';
import { CreatorOsConfigurationModule } from './configuration/configuration.module';
import { CreatorOsAuthModule } from './auth/auth.module';
import { CreatorOsMessagingModule } from './messaging/messaging.module';
import { CreatorOsRuntimeModule } from './runtime/runtime.module';
import { CreatorOsIntegrationLayerModule } from './integrations/integration-layer.module';
import { CreatorOsObservabilityModule } from './observability/observability.module';

@Module({
  imports: [
    CreatorOsConfigurationModule,
    CreatorOsAuthModule,
    CreatorOsMessagingModule,
    CreatorOsRuntimeModule,
    CreatorOsIntegrationLayerModule,
    CreatorOsObservabilityModule,
  ],
  exports: [
    CreatorOsConfigurationModule,
    CreatorOsAuthModule,
    CreatorOsMessagingModule,
    CreatorOsRuntimeModule,
    CreatorOsIntegrationLayerModule,
    CreatorOsObservabilityModule,
  ],
})
export class CreatorOsCoreV1Module {}