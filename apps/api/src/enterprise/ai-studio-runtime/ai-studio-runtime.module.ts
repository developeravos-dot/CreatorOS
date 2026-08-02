import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { AiStudioRuntimeCommandService } from "./ai-studio-runtime-command.service";
import { AiStudioRuntimeController } from "./ai-studio-runtime.controller";
import { AiStudioRuntimeFacadeService } from "./ai-studio-runtime-facade.service";
import { AiStudioRuntimeRegistryService } from "./ai-studio-runtime-registry.service";

@Module({
  imports: [DiscoveryModule],
  controllers: [AiStudioRuntimeController],
  providers: [
    AiStudioRuntimeCommandService,
    AiStudioRuntimeFacadeService,
    AiStudioRuntimeRegistryService,
  ],
  exports: [
    AiStudioRuntimeCommandService,
    AiStudioRuntimeFacadeService,
    AiStudioRuntimeRegistryService,
  ],
})
export class AiStudioRuntimeModule {}
