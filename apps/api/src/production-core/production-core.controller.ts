import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../modules/core-v1/auth/public.decorator';
import { ProductionPlanRequest } from './production-capability.contracts';
import { ProductionRouterService } from './production-router.service';

@Public()
@Controller('enterprise/production-system')
export class ProductionCoreController {
  constructor(private readonly router: ProductionRouterService) {}

  @Get('status')
  status() {
    return this.router.status();
  }

  @Get('health')
  health() {
    return this.router.health();
  }

  @Post('plan')
  plan(@Body() request: ProductionPlanRequest) {
    return this.router.plan(request);
  }
}