import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  EnterpriseAlertEngineService,
  EnterpriseObservabilityOrchestratorService,
  EnterpriseOpenApiRegistryService,
  EnterprisePluginRegistryService,
} from '../services';

@Controller(
  'enterprise/observability',
)
export class EnterpriseObservabilityController {
  constructor(
    private readonly orchestrator:
      EnterpriseObservabilityOrchestratorService,
    private readonly alerts:
      EnterpriseAlertEngineService,
    private readonly plugins:
      EnterprisePluginRegistryService,
    private readonly openApi:
      EnterpriseOpenApiRegistryService,
  ) {}

  @Get('snapshot')
  snapshot() {
    return this.orchestrator.snapshot();
  }

  @Get('plugins')
  pluginList() {
    return this.plugins.list();
  }

  @Get('openapi')
  openApiDocument() {
    return this.openApi.document();
  }

  @Post('metrics')
  recordMetric(
    @Body()
    body: {
      readonly metric: string;
      readonly value: number;
      readonly labels?: Readonly<
        Record<string, string>
      >;
    },
  ) {
    return this.orchestrator.record(
      body,
    );
  }

  @Post('alerts/rules')
  registerRule(
    @Body()
    body: Parameters<
      EnterpriseAlertEngineService[
        'registerRule'
      ]
    >[0],
  ) {
    return this.alerts.registerRule(
      body,
    );
  }
}
