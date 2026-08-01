import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CreateWorldDto } from './dto/create-world.dto';
import { WorldEngineService } from './world-engine.service';

@Controller(
  'enterprise/infinite-universe/world',
)
export class WorldEngineController {
  constructor(
    private readonly worldEngineService:
      WorldEngineService,
  ) {}

  @Get('status')
  getStatus() {
    return this.worldEngineService
      .getStatus();
  }

  @Post('create')
  createWorld(
    @Body()
    dto: CreateWorldDto,
  ) {
    return this.worldEngineService
      .createWorld(dto);
  }

  @Get(':worldId')
  async getWorld(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      world:
        await this.worldEngineService
          .getWorld(worldId),
    };
  }
}
