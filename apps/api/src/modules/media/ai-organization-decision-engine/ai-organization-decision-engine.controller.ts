import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  AgentRole,
  AgentStatus,
  TaskPriority,
  TaskStatus,
} from '../media-ai-organization-core/media-ai-organization-engine.base';

import {
  AiOrganizationDecisionEngineService,
} from './ai-organization-decision-engine.service';

@Controller('media/ai-organization-decision')
export class AiOrganizationDecisionEngineController {
  constructor(
    private readonly service: AiOrganizationDecisionEngineService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }

  @Get('organization-report')
  getOrganizationReport() {
    return this.service.generateOrganizationReport();
  }

  @Get('team-plan/:projectId')
  generateTeamPlan(
    @Param('projectId') projectId: string,
  ) {
    return this.service.generateTeamPlan(projectId);
  }

  @Post('agents')
  createAgent(
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.createAgent(input as never);
  }

  @Get('agents')
  listAgents(
    @Query('role') role?: AgentRole,
    @Query('status') status?: AgentStatus,
    @Query('enabled') enabled?: string,
    @Query('search') search?: string,
  ) {
    return this.service.listAgents({
      role,
      status,
      enabled:
        enabled === undefined
          ? undefined
          : enabled === 'true',
      search,
    });
  }

  @Get('agents/:id')
  getAgent(@Param('id') id: string) {
    return this.service.getAgent(id);
  }

  @Patch('agents/:id')
  updateAgent(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.updateAgent(
      id,
      input as never,
    );
  }

  @Post('agents/:id/enable')
  enableAgent(@Param('id') id: string) {
    return this.service.enableAgent(id);
  }

  @Post('agents/:id/disable')
  disableAgent(@Param('id') id: string) {
    return this.service.disableAgent(id);
  }

  @Post('tasks')
  createTask(
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.createTask(input as never);
  }

  @Get('tasks')
  listTasks(
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('projectId') projectId?: string,
    @Query('agentId') agentId?: string,
    @Query('search') search?: string,
  ) {
    return this.service.listTasks({
      status,
      priority,
      projectId,
      agentId,
      search,
    });
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.service.getTask(id);
  }

  @Patch('tasks/:id')
  updateTask(
    @Param('id') id: string,
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.updateTask(
      id,
      input as never,
    );
  }

  @Post('tasks/:id/assign')
  assignAgents(
    @Param('id') id: string,
    @Body('agentIds') agentIds: string[],
  ) {
    return this.service.assignAgents(
      id,
      agentIds ?? [],
    );
  }

  @Post('tasks/:id/start')
  startTask(@Param('id') id: string) {
    return this.service.startTask(id);
  }

  @Post('tasks/:id/block')
  blockTask(
    @Param('id') id: string,
    @Body('blocker') blocker: string,
  ) {
    return this.service.blockTask(
      id,
      blocker ?? 'Unknown blocker',
    );
  }

  @Post('tasks/:id/human-review')
  submitTaskForHumanReview(
    @Param('id') id: string,
  ) {
    return this.service.submitTaskForHumanReview(
      id,
    );
  }

  @Post('tasks/:id/human-approve')
  approveTask(@Param('id') id: string) {
    return this.service.approveTask(id);
  }

  @Post('tasks/:id/human-reject')
  rejectTask(@Param('id') id: string) {
    return this.service.rejectTask(id);
  }

  @Post('tasks/:id/complete')
  completeTask(@Param('id') id: string) {
    return this.service.completeTask(id);
  }

  @Post('workflows')
  createWorkflow(
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.createWorkflow(
      input as never,
    );
  }

  @Get('workflows')
  listWorkflows() {
    return this.service.listWorkflows();
  }

  @Get('workflows/:id')
  getWorkflow(@Param('id') id: string) {
    return this.service.getWorkflow(id);
  }

  @Post('workflows/:id/start')
  startWorkflow(@Param('id') id: string) {
    return this.service.startWorkflow(id);
  }

  @Post('workflows/:id/pause')
  pauseWorkflow(@Param('id') id: string) {
    return this.service.pauseWorkflow(id);
  }

  @Post('workflows/:id/human-review')
  submitWorkflowForHumanReview(
    @Param('id') id: string,
  ) {
    return this.service.submitWorkflowForHumanReview(
      id,
    );
  }

  @Post('workflows/:id/human-approve')
  approveWorkflow(@Param('id') id: string) {
    return this.service.approveWorkflow(id);
  }

  @Post('workflows/:id/complete')
  completeWorkflow(@Param('id') id: string) {
    return this.service.completeWorkflow(id);
  }

  @Post('memory')
  writeMemory(
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.writeMemory(input as never);
  }

  @Get('memory')
  listMemory(
    @Query('namespace') namespace?: string,
  ) {
    return this.service.listMemory(namespace);
  }

  @Post('memory/:id/human-approve')
  approveMemory(@Param('id') id: string) {
    return this.service.approveMemory(id);
  }

  @Post('decisions')
  createDecision(
    @Body() input: Record<string, unknown>,
  ) {
    return this.service.createDecision(
      input as never,
    );
  }

  @Get('decisions')
  listDecisions() {
    return this.service.listDecisions();
  }

  @Post('decisions/:id/human-review')
  submitDecisionForHumanReview(
    @Param('id') id: string,
  ) {
    return this.service.submitDecisionForHumanReview(
      id,
    );
  }

  @Post('decisions/:id/human-approve')
  approveDecision(
    @Param('id') id: string,
    @Body('decidedBy') decidedBy: string,
  ) {
    return this.service.approveDecision(
      id,
      decidedBy,
    );
  }

  @Post('decisions/:id/human-reject')
  rejectDecision(
    @Param('id') id: string,
    @Body('decidedBy') decidedBy: string,
  ) {
    return this.service.rejectDecision(
      id,
      decidedBy,
    );
  }

  @Post('decisions/:id/execute')
  executeDecision(@Param('id') id: string) {
    return this.service.executeDecision(id);
  }
}
