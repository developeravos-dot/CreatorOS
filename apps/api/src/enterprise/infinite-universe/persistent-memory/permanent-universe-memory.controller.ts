import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { PermanentUniverseMemoryService } from './permanent-universe-memory.service';

@Controller(
  'enterprise/infinite-universe/memory',
)
export class PermanentUniverseMemoryController {
  constructor(
    private readonly memory:
      PermanentUniverseMemoryService,
  ) {}

  @Get('status')
  getStatus() {
    return this.memory.getStatus();
  }

  @Get('world/:worldId')
  async getWorld(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      world:
        await this.memory
          .loadWorld(worldId),
    };
  }

  @Get('world/:worldId/characters')
  async getCharacters(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      characters:
        await this.memory
          .loadCharacters(worldId),
    };
  }

  @Get('audit')
  async getAudit(
    @Query('worldId')
    worldId?: string,

    @Query(
      'limit',
      new ParseIntPipe({
        optional: true,
      }),
    )
    limit?: number,
  ) {
    return {
      success: true,

      records:
        await this.memory.readAudit(
          worldId,
          limit ?? 100,
        ),
    };
  }

  @Delete('world/:worldId')
  async deleteWorld(
    @Param('worldId')
    worldId: string,
  ) {
    await this.memory
      .deleteWorldMemory(worldId);

    return {
      success: true,
      worldId,
      status: 'deleted',
    };
  }
}
