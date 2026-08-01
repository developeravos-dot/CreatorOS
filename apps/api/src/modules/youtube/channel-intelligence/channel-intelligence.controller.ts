import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateIntelligenceSignalInput,
  IntelligenceSignalPriority,
  IntelligenceSignalStatus,
  UpdateIntelligenceSignalInput,
} from '../intelligence-core/intelligence-engine.base';

import {
  ChannelIntelligenceService,
} from './channel-intelligence.service';

@Controller('youtube/channel-intelligence')
export class ChannelIntelligenceController {
  constructor(
    private readonly service: ChannelIntelligenceService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('signals')
  listSignals(
    @Query('category') category?: string,
    @Query('status') status?: IntelligenceSignalStatus,
    @Query('priority') priority?: IntelligenceSignalPriority,
    @Query('search') search?: string,
  ) {
    return this.service.listSignals({
      category,
      status,
      priority,
      search,
    });
  }

  @Get('signals/top')
  getTopSignals(
    @Query('limit') limit?: string,
  ) {
    return this.service.getTopSignals(
      Number(limit ?? 10),
    );
  }

  @Get('signals/:id')
  getSignal(@Param('id') id: string) {
    return this.service.getSignal(id);
  }

  @Post('signals')
  createSignal(
    @Body() input: CreateIntelligenceSignalInput,
  ) {
    return this.service.createSignal(input);
  }

  @Patch('signals/:id')
  updateSignal(
    @Param('id') id: string,
    @Body() input: UpdateIntelligenceSignalInput,
  ) {
    return this.service.updateSignal(id, input);
  }

  @Post('signals/:id/advance')
  advanceSignal(@Param('id') id: string) {
    return this.service.advanceSignal(id);
  }

  @Post('signals/:id/reject')
  rejectSignal(@Param('id') id: string) {
    return this.service.rejectSignal(id);
  }

  @Delete('signals/:id')
  removeSignal(@Param('id') id: string) {
    return this.service.removeSignal(id);
  }

  @Post('analyze')
  analyzeText(
    @Body('content') content: string,
  ) {
    return this.service.analyzeText(content);
  }
}
