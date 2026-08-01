import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import type {
  CompleteTaskInput,
  CreateWorkflowDefinitionInput,
  FailTaskInput,
  StartWorkflowInput,
} from '@creatoros/workflow';
import {
  InvalidWorkflowStateError,
  WorkflowDefinitionNotFoundError,
  WorkflowInstanceNotFoundError,
  WorkflowValidationError,
} from '@creatoros/workflow';
import { WorkflowService } from './workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(
    private readonly workflowService:
      WorkflowService,
  ) {}

  @Get('status')
  getStatus() {
    return this.workflowService.getStatus();
  }

  @Get('definitions')
  getDefinitions() {
    return this.workflowService.getDefinitions();
  }

  @Get('definitions/:definitionId')
  getDefinitionById(
    @Param('definitionId') definitionId: string,
  ) {
    const definition =
      this.workflowService.getDefinitionById(
        definitionId,
      );

    if (!definition) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Workflow Definition Not Found',
        message:
          `Workflow definition ${definitionId} was not found`,
      });
    }

    return definition;
  }

  @Post('definitions')
  createDefinition(
    @Body()
    input: CreateWorkflowDefinitionInput,
  ) {
    try {
      return this.workflowService.createDefinition(
        input,
      );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  @Get('instances')
  getInstances() {
    return this.workflowService.getInstances();
  }

  @Get('instances/:instanceId')
  getInstanceById(
    @Param('instanceId') instanceId: string,
  ) {
    const instance =
      this.workflowService.getInstanceById(
        instanceId,
      );

    if (!instance) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Workflow Instance Not Found',
        message:
          `Workflow instance ${instanceId} was not found`,
      });
    }

    return instance;
  }

  @Post('instances')
  startWorkflow(
    @Body()
    input: StartWorkflowInput,
  ) {
    try {
      return this.workflowService.startWorkflow(
        input,
      );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  @Post('instances/:instanceId/tasks/complete')
  completeCurrentTask(
    @Param('instanceId') instanceId: string,
    @Body()
    input: CompleteTaskInput,
  ) {
    try {
      return this.workflowService
        .completeCurrentTask(
          instanceId,
          input ?? {},
        );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  @Post('instances/:instanceId/tasks/fail')
  failCurrentTask(
    @Param('instanceId') instanceId: string,
    @Body()
    input: FailTaskInput,
  ) {
    try {
      return this.workflowService
        .failCurrentTask(
          instanceId,
          input,
        );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  @Post('instances/:instanceId/pause')
  pauseWorkflow(
    @Param('instanceId') instanceId: string,
  ) {
    try {
      return this.workflowService.pauseWorkflow(
        instanceId,
      );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  @Post('instances/:instanceId/resume')
  resumeWorkflow(
    @Param('instanceId') instanceId: string,
  ) {
    try {
      return this.workflowService.resumeWorkflow(
        instanceId,
      );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  @Post('instances/:instanceId/cancel')
  cancelWorkflow(
    @Param('instanceId') instanceId: string,
  ) {
    try {
      return this.workflowService.cancelWorkflow(
        instanceId,
      );
    } catch (error) {
      this.handleWorkflowError(error);
    }
  }

  private handleWorkflowError(
    error: unknown,
  ): never {
    if (
      error instanceof
        WorkflowDefinitionNotFoundError ||
      error instanceof
        WorkflowInstanceNotFoundError
    ) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Workflow Resource Not Found',
        message: error.message,
      });
    }

    if (
      error instanceof
        InvalidWorkflowStateError ||
      error instanceof
        WorkflowValidationError
    ) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Invalid Workflow Operation',
        message: error.message,
      });
    }

    throw error;
  }
}
