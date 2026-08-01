import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { GenerateEpisodeDto } from './dto/generate-episode.dto';
import { EndlessEpisodeEngineService } from './endless-episode-engine.service';

@Controller(
  'enterprise/infinite-universe/episodes',
)
export class EndlessEpisodeEngineController {
  constructor(
    private readonly episodeEngine:
      EndlessEpisodeEngineService,
  ) {}

  @Get('status')
  getStatus() {
    return this.episodeEngine
      .getStatus();
  }

  @Post('generate')
  generate(
    @Body()
    dto: GenerateEpisodeDto,
  ) {
    return this.episodeEngine
      .generate(dto);
  }

  @Get('world/:worldId')
  async getEpisodes(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      episodes:
        await this.episodeEngine
          .getEpisodes(worldId),
    };
  }
}
