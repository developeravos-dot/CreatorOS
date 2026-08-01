import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GlobalMediaIpPlatformService } from './global-media-ip-platform.service';
import { GlobalMediaAssetInput } from './global-media-ip-platform.types';

@Controller('media/global-ip-platform')
export class GlobalMediaIpPlatformController {
  constructor(private readonly platform: GlobalMediaIpPlatformService) {}

  @Get('capabilities')
  capabilities() {
    return this.platform.capabilities();
  }

  @Get('dashboard')
  dashboard() {
    return this.platform.dashboard();
  }

  @Get('assets')
  list() {
    return this.platform.list();
  }

  @Get('assets/:id')
  get(@Param('id') id: string) {
    return this.platform.get(id);
  }

  @Post('assets')
  create(@Body() input: GlobalMediaAssetInput) {
    return this.platform.create(input);
  }

  @Post('assets/:id/approve-strategy')
  approveStrategy(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.platform.approveStrategy(id, body.approvedBy);
  }

  @Post('assets/:id/approve-commercial')
  approveCommercial(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.platform.approveCommercial(id, body.approvedBy);
  }

  @Post('assets/:id/activate')
  activate(@Param('id') id: string) {
    return this.platform.activate(id);
  }

  @Patch('assets/:id/performance')
  updatePerformance(
    @Param('id') id: string,
    @Body() body: { reach?: number; engagement?: number; retention?: number; revenue?: number; licensingInterest?: number },
  ) {
    return this.platform.updatePerformance(id, body);
  }

  @Patch('assets/:id/learn')
  learn(
    @Param('id') id: string,
    @Body() body: { source: string; signal: string; value: number },
  ) {
    return this.platform.learn(id, body.source, body.signal, body.value);
  }

  @Post('assets/:id/pause')
  pause(@Param('id') id: string) {
    return this.platform.pause(id);
  }
}