import { Injectable } from '@nestjs/common';
import { PlatformIntegrationMp2Service } from './integration/platform-integration-mp2.service';
import { PlatformIntegrationMp3Service } from './integration/platform-integration-mp3.service';
import { PlatformWorkflowEngineService } from './workflows/platform-workflow-engine.service';

@Injectable()
export class PlatformCoreOrchestratorService {
  constructor(
    private readonly mp2:
      PlatformIntegrationMp2Service,
    private readonly mp3:
      PlatformIntegrationMp3Service,
    private readonly workflows:
      PlatformWorkflowEngineService,
  ) {}

  bootstrap() {
    const capabilities =
      this.mp2.bootstrapDefaultCapabilities();

    return {
      bootstrapped: true,
      capabilities,
      status: this.mp3.status(),
    };
  }

  createWorkflow(input: {
    name: string;
    steps: Array<{
      name: string;
      capability: string;
      command: string;
      dependsOn: string[];
    }>;
  }) {
    return this.workflows.create(
      input.name,
      input.steps,
    );
  }

  prepareWorkflow(workflowId: string) {
    return this.workflows.prepare(
      workflowId,
    );
  }

  executeWorkflow(workflowId: string) {
    return this.workflows.execute(
      workflowId,
    );
  }

  status() {
    return this.mp3.status();
  }
}