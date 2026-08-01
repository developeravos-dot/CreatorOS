import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ResolveCompatibleProviderDto } from './dto/resolve-compatible-provider.dto';

import { ProviderCompatibilityService } from './provider-compatibility.service';

@Controller(
  'enterprise/infinite-universe/provider-compatibility',
)
export class ProviderCompatibilityController {
  constructor(
    private readonly service:
      ProviderCompatibilityService,
  ) {}

  @Get('status')
  getStatus() {
    return this.service
      .getStatus();
  }

  @Get('profiles')
  getProfiles() {
    return this.service
      .getProfiles();
  }

  @Get('profiles/:providerId')
  getProfile(
    @Param('providerId')
    providerId: string,
  ) {
    return this.service
      .getProfile(providerId);
  }

  @Post('resolve')
  resolve(
    @Body()
    dto: ResolveCompatibleProviderDto,
  ) {
    return this.service
      .resolve(dto);
  }
}
