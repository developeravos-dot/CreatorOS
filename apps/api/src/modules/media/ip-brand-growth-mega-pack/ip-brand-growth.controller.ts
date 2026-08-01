import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IpBrandGrowthOrchestratorService } from './ip-brand-growth-orchestrator.service';
import { IpGrowthBrief } from './ip-brand-growth.types';

@Controller('media/ip-brand-growth')
export class IpBrandGrowthController {
  constructor(
    private readonly orchestrator: IpBrandGrowthOrchestratorService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return this.orchestrator.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.orchestrator.dashboard();
  }

  @Post('programs')
  create(@Body() body: IpGrowthBrief) {
    return this.orchestrator.create(body);
  }

  @Get('programs')
  list() {
    return this.orchestrator.list();
  }

  @Get('programs/:id')
  get(@Param('id') id: string) {
    return this.orchestrator.get(id);
  }

  @Post('programs/:id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.orchestrator.approve(id, body.approvedBy);
  }

  @Post('programs/:id/activate')
  activate(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.activate(id, body.actor);
  }

  @Post('programs/:id/complete')
  complete(
    @Param('id') id: string,
    @Body() body: { actor: string },
  ) {
    return this.orchestrator.complete(id, body.actor);
  }
}