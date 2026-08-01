import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { GenerateCinematicScriptDto } from './dto/generate-cinematic-script.dto';
import { CinematicScriptEngineService } from './cinematic-script-engine.service';

@Controller(
  'enterprise/infinite-universe/scripts',
)
export class CinematicScriptEngineController {
  constructor(
    private readonly scriptEngine:
      CinematicScriptEngineService,
  ) {}

  @Get('status')
  getStatus() {
    return this.scriptEngine
      .getStatus();
  }

  @Post('generate')
  generate(
    @Body()
    dto: GenerateCinematicScriptDto,
  ) {
    return this.scriptEngine
      .generate(dto);
  }

  @Get('world/:worldId')
  async getWorldScripts(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      scripts:
        await this.scriptEngine
          .getWorldScripts(
            worldId,
          ),
    };
  }
}
