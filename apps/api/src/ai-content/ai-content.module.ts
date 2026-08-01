import { ProductionFrameworkModule } from '../production-framework/production-framework.module';
import { Module } from '@nestjs/common';
import { HailuoModule } from '../production-adapters/hailuo/hailuo.module';
import { ProductionExecutionModule } from '../production-execution/production-execution.module';
import { ProductionCoreModule } from '../production-core/production-core.module';
import { AiContentController } from './ai-content.controller';
import { AiContentService } from './ai-content.service';
import { AiProviderRegistryService } from './providers/ai-provider-registry.service';
import { AiProviderRouterService } from './providers/ai-provider-router.service';
import { OllamaTextProvider } from './providers/ollama-text.provider';
import { OpenAiTextProvider } from './providers/openai-text.provider';

@Module({
  imports: [ProductionFrameworkModule, HailuoModule, ProductionExecutionModule, ProductionCoreModule],
  controllers: [AiContentController],
  providers: [
    AiContentService,
    OpenAiTextProvider,
    OllamaTextProvider,
    AiProviderRegistryService,
    AiProviderRouterService,
  ],
  exports: [
    AiContentService,
    AiProviderRegistryService,
    AiProviderRouterService,
  ],
})
export class AiContentModule {}
