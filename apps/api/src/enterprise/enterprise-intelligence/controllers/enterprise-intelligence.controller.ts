import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import type {
  EnterpriseSignal,
} from '../contracts';
import {
  EnterpriseDecisionEngineService,
  EnterpriseIntelligenceOrchestratorService,
} from '../services';

@Controller(
  'enterprise/intelligence',
)
export class EnterpriseIntelligenceController {
  constructor(
    private readonly orchestrator:
      EnterpriseIntelligenceOrchestratorService,
    private readonly decisions:
      EnterpriseDecisionEngineService,
  ) {}

  @Get('decisions')
  listDecisions() {
    return this.decisions.list();
  }

  @Post('analyze')
  analyze(
    @Body()
    body: {
      readonly analysisId: string;
      readonly objective: string;
      readonly signals:
        readonly EnterpriseSignal[];
    },
  ) {
    return this.orchestrator.analyze(
      body,
    );
  }

  @Post('decisions/resolve')
  resolve(
    @Body()
    body: {
      readonly decisionId: string;
      readonly approved: boolean;
    },
  ) {
    return this.decisions.resolve(
      body.decisionId,
      body.approved,
    );
  }
}
