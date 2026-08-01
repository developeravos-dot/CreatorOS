import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { GenerateStoryboardDto } from './dto/generate-storyboard.dto';
import { StoryboardEngineService } from './storyboard-engine.service';

@Controller(
  'enterprise/infinite-universe/storyboards',
)
export class StoryboardEngineController {
  constructor(
    private readonly storyboardEngine:
      StoryboardEngineService,
  ) {}

  @Get('status')
  getStatus() {
    return this.storyboardEngine
      .getStatus();
  }

  @Post('generate')
  generate(
    @Body()
    dto: GenerateStoryboardDto,
  ) {
    return this.storyboardEngine
      .generate(dto);
  }

  @Get('world/:worldId')
  async getWorldStoryboards(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      storyboards:
        await this.storyboardEngine
          .getWorldStoryboards(
            worldId,
          ),
    };
  }
}
