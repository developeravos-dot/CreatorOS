import { Module } from '@nestjs/common';
import { RegistryModule } from '../registry/registry.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { MessagingModule } from '../messaging/messaging.module';
import { RuntimeModule } from '../runtime/runtime.module';
import { BlueprintModule } from '../blueprint/blueprint.module';
import { PlatformStatusController } from './platform-status.controller';
import { PlatformStatusService } from './platform-status.service';

@Module({
  imports: [
    RegistryModule,
    EventBusModule,
    KnowledgeModule,
    WorkflowModule,
    MessagingModule,
    RuntimeModule,
    BlueprintModule,
  ],
  controllers: [
    PlatformStatusController,
  ],
  providers: [
    PlatformStatusService,
  ],
  exports: [
    PlatformStatusService,
  ],
})
export class PlatformStatusModule {}

