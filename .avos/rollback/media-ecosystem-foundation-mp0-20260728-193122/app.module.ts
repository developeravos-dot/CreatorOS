import { PersistenceModule } from './modules/persistence';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './modules/config/config.module';
import { LoggingModule } from './modules/logging/logging.module';
import { CoreModule } from './modules/core/core.module';
import { CapabilityModule } from './modules/capabilities/capability.module';
import { DomainModule } from './modules/domains/domain.module';
import { RegistryModule } from './modules/registry/registry.module';
import { DependencyModule } from './modules/dependencies/dependency.module';
import { PlatformStatusModule } from './modules/platform-status/platform-status.module';
import { EventBusModule } from './modules/event-bus/event-bus.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { RuntimeModule } from './modules/runtime/runtime.module';
import { BlueprintModule } from './modules/blueprint/blueprint.module';

import { ApiLayerModule } from './modules/api-layer/api-layer.module';
import { CreatorOsCoreV1Module } from './modules/core-v1/core-v1.module';
import { CreatorOsCoreV1CompletionModule } from './modules/core-v1-completion/core-v1-completion.module';
@Module({
  imports: [
    CreatorOsCoreV1CompletionModule,
    CreatorOsCoreV1Module,
    ApiLayerModule,
    PersistenceModule,
    ConfigModule,
    LoggingModule,
    CoreModule,
    CapabilityModule,
    DomainModule,
    RegistryModule,
    DependencyModule,
    EventBusModule,
    KnowledgeModule,
    WorkflowModule,
    MessagingModule,
    RuntimeModule,
    BlueprintModule,
    PlatformStatusModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}


