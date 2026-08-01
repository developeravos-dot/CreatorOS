import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { GenerateNoveltyIdeaDto } from './dto/generate-novelty-idea.dto';
import { NoveltyGenerationService } from './novelty-generation.service';

import { GenerateNoveltyV2Dto } from './v2/dto/generate-novelty-v2.dto';
import { NoveltyGenerationV2Service } from './v2/novelty-generation-v2.service';

import { GenerateNoveltyV3Dto } from './v3/dto/generate-novelty-v3.dto';
import { NoveltyGenerationV3Service } from './v3/novelty-generation-v3.service';

import { GenerateNoveltyV31Dto } from './v3-1/dto/generate-novelty-v3-1.dto';
import { NoveltyGenerationV31Service } from './v3-1/novelty-generation-v3-1.service';

import { GenerateNoveltyV32Dto } from './v3-2/dto/generate-novelty-v3-2.dto';
import { NoveltyGenerationV32Service } from './v3-2/novelty-generation-v3-2.service';

import { GenerateNoveltyV33Dto } from './v3-3/dto/generate-novelty-v3-3.dto';
import { NoveltyGenerationV33Service } from './v3-3/novelty-generation-v3-3.service';

@Controller('enterprise/intelligence/novelty')
export class NoveltyGenerationController {
  constructor(
    private readonly noveltyGenerationService:
      NoveltyGenerationService,

    private readonly noveltyGenerationV2Service:
      NoveltyGenerationV2Service,

    private readonly noveltyGenerationV3Service:
      NoveltyGenerationV3Service,

    private readonly noveltyGenerationV31Service:
      NoveltyGenerationV31Service,

    private readonly noveltyGenerationV32Service:
      NoveltyGenerationV32Service,

    private readonly noveltyGenerationV33Service:
      NoveltyGenerationV33Service,
  ) {}

  @Get('status')
  getStatus() {
    return this.noveltyGenerationService.getStatus();
  }

  @Post('generate')
  generate(
    @Body() dto: GenerateNoveltyIdeaDto,
  ) {
    return this.noveltyGenerationService.generate(dto);
  }

  @Get('v2/status')
  getV2Status() {
    return this.noveltyGenerationV2Service.getStatus();
  }

  @Post('v2/generate')
  generateV2(
    @Body() dto: GenerateNoveltyV2Dto,
  ) {
    return this.noveltyGenerationV2Service.generate(dto);
  }

  @Get('v3/status')
  getV3Status() {
    return this.noveltyGenerationV3Service.getStatus();
  }

  @Post('v3/generate')
  generateV3(
    @Body() dto: GenerateNoveltyV3Dto,
  ) {
    return this.noveltyGenerationV3Service.generate(dto);
  }

  @Get('v3-1/status')
  getV31Status() {
    return this.noveltyGenerationV31Service.getStatus();
  }

  @Post('v3-1/generate')
  generateV31(
    @Body() dto: GenerateNoveltyV31Dto,
  ) {
    return this.noveltyGenerationV31Service.generate(dto);
  }

  @Get('v3-2/status')
  getV32Status() {
    return this.noveltyGenerationV32Service.getStatus();
  }

  @Post('v3-2/search-and-calibrate')
  async searchAndCalibrateV32(
    @Body() dto: GenerateNoveltyV32Dto,
  ) {
    return this.noveltyGenerationV32Service.generate(dto);
  }

  @Get('v3-3/status')
  getV33Status() {
    return this.noveltyGenerationV33Service.getStatus();
  }

  @Post('v3-3/analyze')
  async analyzeV33(
    @Body() dto: GenerateNoveltyV33Dto,
  ) {
    return this.noveltyGenerationV33Service.generate(dto);
  }
}
