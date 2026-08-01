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
  CreateProductionTaskInput,
  CreativeProductionService,
  ProductionPriority,
  ProductionStatus,
  ProductionType,
  UpdateProductionTaskInput,
} from './creative-production.service';

@Controller('youtube/creative-production')
export class CreativeProductionController {
  constructor(
    private readonly creativeProductionService: CreativeProductionService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.creativeProductionService.getDashboard();
  }

  @Get('board')
  getProductionBoard() {
    return this.creativeProductionService.getProductionBoard();
  }

  @Get('tasks')
  listTasks(
    @Query('type') type?: ProductionType,
    @Query('status') status?: ProductionStatus,
    @Query('priority') priority?: ProductionPriority,
    @Query('channelId') channelId?: string,
    @Query('assignedTeam') assignedTeam?: string,
    @Query('search') search?: string,
  ) {
    return this.creativeProductionService.listTasks({
      type,
      status,
      priority,
      channelId,
      assignedTeam,
      search,
    });
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.creativeProductionService.getTask(id);
  }

  @Post('tasks')
  createTask(
    @Body() input: CreateProductionTaskInput,
  ) {
    return this.creativeProductionService.createTask(input);
  }

  @Patch('tasks/:id')
  updateTask(
    @Param('id') id: string,
    @Body() input: UpdateProductionTaskInput,
  ) {
    return this.creativeProductionService.updateTask(
      id,
      input,
    );
  }

  @Post('tasks/:id/advance')
  advanceTask(@Param('id') id: string) {
    return this.creativeProductionService.advanceTask(id);
  }

  @Post('tasks/:id/cancel')
  cancelTask(@Param('id') id: string) {
    return this.creativeProductionService.cancelTask(id);
  }

  @Delete('tasks/:id')
  removeTask(@Param('id') id: string) {
    return this.creativeProductionService.removeTask(id);
  }
}
