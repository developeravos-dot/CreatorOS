import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { GenerateVisualReferenceBibleDto } from './dto/generate-visual-reference-bible.dto';
import { VisualReferenceBibleService } from './visual-reference-bible.service';

@Controller(
  'enterprise/infinite-universe/visual-reference-bibles',
)
export class VisualReferenceBibleController {
  constructor(
    private readonly service:
      VisualReferenceBibleService,
  ) {}

  @Get('status')
  getStatus() {
    return this.service.getStatus();
  }

  @Post('generate')
  generate(
    @Body()
    dto: GenerateVisualReferenceBibleDto,
  ) {
    return this.service.generate(
      dto,
    );
  }

  @Get('world/:worldId')
  async getWorldBibles(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      bibles:
        await this.service
          .getWorldBibles(
            worldId,
          ),
    };
  }
}
