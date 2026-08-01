import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ReviewProviderMigrationDto } from './dto/review-provider-migration.dto';
import { RunProviderMigrationTestDto } from './dto/run-provider-migration-test.dto';

import { ProviderMigrationGateService } from './provider-migration-gate.service';

@Controller(
  'enterprise/infinite-universe/provider-migration',
)
export class ProviderMigrationGateController {
  constructor(
    private readonly service:
      ProviderMigrationGateService,
  ) {}

  @Get('status')
  getStatus() {
    return this.service
      .getStatus();
  }

  @Post('tests')
  runTest(
    @Body()
    dto: RunProviderMigrationTestDto,
  ) {
    return this.service
      .runTest(dto);
  }

  @Post('review')
  review(
    @Body()
    dto: ReviewProviderMigrationDto,
  ) {
    return this.service
      .review(dto);
  }

  @Get('world/:worldId/tests')
  async getTests(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      tests:
        await this.service
          .getTests(worldId),
    };
  }

  @Get('world/:worldId/locks')
  async getLocks(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      locks:
        await this.service
          .getLocks(worldId),
    };
  }
}
