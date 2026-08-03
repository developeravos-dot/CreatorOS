import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import {
  BulkDependencyAnalysisDto,
  ResolveCapabilityDependenciesDto,
} from '../dto';
import {
  CapabilityDependencyManagementService,
} from '../services';

@Controller(
  'capability-platform/management/dependencies',
)
export class CapabilityDependencyManagementController {
  constructor(
    private readonly dependencies:
      CapabilityDependencyManagementService,
  ) {}

  @Post('resolve')
  resolve(
    @Body()
    input:
      ResolveCapabilityDependenciesDto,
  ) {
    return this.dependencies.resolve(
      input,
    );
  }

  @Post('plan')
  createPlan(
    @Body()
    input:
      ResolveCapabilityDependenciesDto,
  ) {
    return this.dependencies.createPlan(
      input,
    );
  }

  @Post('summary')
  summarize(
    @Body()
    input:
      ResolveCapabilityDependenciesDto,
  ) {
    return this.dependencies.summarize(
      input,
    );
  }

  @Post('bulk/analyze')
  bulkAnalyze(
    @Body()
    input:
      BulkDependencyAnalysisDto,
  ) {
    return this.dependencies.bulkAnalyze(
      input,
    );
  }
}