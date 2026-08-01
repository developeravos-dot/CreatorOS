import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  GenerateIdeasDto,
  GenerateScriptDto,
  OptimizeContentDto,
  ProductionPackageDto,
  ReviewContentDto,
} from './ai-content.dto';
import { AiContentService } from './ai-content.service';
import { Public } from '../modules/core-v1/auth/public.decorator';

@Public()
@Controller('enterprise/ai-content')
export class AiContentController {
  constructor(
    private readonly aiContentService: AiContentService,
  ) {}

  @Get('status')
  status() {
    return this.aiContentService.status();
  }

  @Post('ideas')
  generateIdeas(@Body() input: GenerateIdeasDto) {
    return this.aiContentService.generateIdeas(input);
  }

  @Post('scripts')
  generateScript(@Body() input: GenerateScriptDto) {
    return this.aiContentService.generateScript(input);
  }

  @Post('optimize')
  optimize(@Body() input: OptimizeContentDto) {
    return this.aiContentService.optimize(input);
  }

  @Post('review')
  review(@Body() input: ReviewContentDto) {
    return this.aiContentService.review(input);
  }

  @Post('production-package')
  createProductionPackage(
    @Body() input: ProductionPackageDto,
  ) {
    return this.aiContentService.createProductionPackage(input);
  }
}


