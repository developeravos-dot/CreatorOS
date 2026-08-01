import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  ApproveBlueprintInput,
  CreateBlueprintInput,
  UpdateBlueprintInput,
} from '@creatoros/blueprint';
import {
  BlueprintLifecycleError,
  BlueprintNotFoundError,
  BlueprintValidationError,
} from '@creatoros/blueprint';
import { BlueprintService } from './blueprint.service';

@Controller('blueprints')
export class BlueprintController {
  constructor(
    private readonly blueprintService:
      BlueprintService,
  ) {}

  @Get('status')
  getStatus() {
    return this.blueprintService
      .getStatus();
  }

  @Get()
  getBlueprints() {
    return this.blueprintService
      .getBlueprints();
  }

  @Get('by-key/:blueprintKey')
  getBlueprintByKey(
    @Param('blueprintKey')
    blueprintKey: string,
  ) {
    const blueprint =
      this.blueprintService
        .getBlueprintByKey(
          blueprintKey,
        );

    if (!blueprint) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Blueprint Not Found',
        message:
          `Blueprint ${blueprintKey} was not found`,
      });
    }

    return blueprint;
  }

  @Get(':blueprintId')
  getBlueprintById(
    @Param('blueprintId')
    blueprintId: string,
  ) {
    const blueprint =
      this.blueprintService
        .getBlueprintById(
          blueprintId,
        );

    if (!blueprint) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Blueprint Not Found',
        message:
          `Blueprint ${blueprintId} was not found`,
      });
    }

    return blueprint;
  }

  @Post()
  createBlueprint(
    @Body()
    input: CreateBlueprintInput,
  ) {
    try {
      return this.blueprintService
        .createBlueprint(input);
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Patch(':blueprintId')
  updateBlueprint(
    @Param('blueprintId')
    blueprintId: string,
    @Body()
    input: UpdateBlueprintInput,
  ) {
    try {
      return this.blueprintService
        .updateBlueprint(
          blueprintId,
          input,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Post(':blueprintId/validate')
  validateBlueprint(
    @Param('blueprintId')
    blueprintId: string,
  ) {
    try {
      return this.blueprintService
        .validateBlueprint(
          blueprintId,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Post(':blueprintId/approval-gates')
  approveGate(
    @Param('blueprintId')
    blueprintId: string,
    @Body()
    input: ApproveBlueprintInput,
  ) {
    try {
      return this.blueprintService
        .approveGate(
          blueprintId,
          input,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Post(':blueprintId/activate')
  activateBlueprint(
    @Param('blueprintId')
    blueprintId: string,
  ) {
    try {
      return this.blueprintService
        .activateBlueprint(
          blueprintId,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Post(':blueprintId/archive')
  archiveBlueprint(
    @Param('blueprintId')
    blueprintId: string,
  ) {
    try {
      return this.blueprintService
        .archiveBlueprint(
          blueprintId,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Post(':blueprintId/execution-plans')
  generateExecutionPlan(
    @Param('blueprintId')
    blueprintId: string,
  ) {
    try {
      return this.blueprintService
        .generateExecutionPlan(
          blueprintId,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Get('execution-plans/list')
  getExecutionPlans(
    @Query('blueprintId')
    blueprintId?: string,
  ) {
    return this.blueprintService
      .getExecutionPlans(
        blueprintId,
      );
  }

  @Get(':blueprintId/versions')
  getVersions(
    @Param('blueprintId')
    blueprintId: string,
  ) {
    try {
      return this.blueprintService
        .getVersions(
          blueprintId,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  @Get(':blueprintId/diff')
  getDiff(
    @Param('blueprintId')
    blueprintId: string,
    @Query(
      'fromVersion',
      ParseIntPipe,
    )
    fromVersion: number,
    @Query(
      'toVersion',
      ParseIntPipe,
    )
    toVersion: number,
  ) {
    try {
      return this.blueprintService
        .getDiff(
          blueprintId,
          fromVersion,
          toVersion,
        );
    } catch (error) {
      this.handleBlueprintError(error);
    }
  }

  private handleBlueprintError(
    error: unknown,
  ): never {
    if (
      error instanceof
      BlueprintNotFoundError
    ) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Blueprint Resource Not Found',
        message: error.message,
      });
    }

    if (
      error instanceof
        BlueprintValidationError ||
      error instanceof
        BlueprintLifecycleError
    ) {
      throw new BadRequestException({
        statusCode: 400,
        error:
          'Invalid Blueprint Operation',
        message: error.message,
      });
    }

    throw error;
  }
}
