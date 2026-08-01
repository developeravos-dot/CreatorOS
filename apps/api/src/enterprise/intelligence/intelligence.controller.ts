import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { GenerateIntelligenceDto } from './dto/generate-intelligence.dto';
import { IntelligenceRouterService } from './intelligence-router.service';

@Controller('enterprise/intelligence')
export class IntelligenceController {
  constructor(
    private readonly router: IntelligenceRouterService,
  ) {}

  @Get('status')
  getStatus() {
    return this.router.getStatus();
  }

  @Post('generate')
  generate(@Body() body: GenerateIntelligenceDto) {
    return this.router.generate(body);
  }
}
