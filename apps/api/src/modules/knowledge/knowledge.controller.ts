import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  CreateKnowledgeObjectInput,
  CreateKnowledgeRelationInput,
  UpdateKnowledgeObjectInput,
} from '@creatoros/knowledge';
import {
  InvalidKnowledgeRelationError,
  KnowledgeObjectNotFoundError,
} from '@creatoros/knowledge';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(
    private readonly knowledgeService:
      KnowledgeService,
  ) {}

  @Get('status')
  getStatus() {
    return this.knowledgeService.getStatus();
  }

  @Get('objects')
  getObjects(
    @Query('query') query?: string,
  ) {
    return this.knowledgeService.getObjects(query);
  }

  @Get('objects/:objectId')
  getObjectById(
    @Param('objectId') objectId: string,
  ) {
    const knowledgeObject =
      this.knowledgeService.getObjectById(
        objectId,
      );

    if (!knowledgeObject) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Knowledge Object Not Found',
        message:
          `Knowledge object ${objectId} was not found`,
      });
    }

    return knowledgeObject;
  }

  @Post('objects')
  createObject(
    @Body()
    input: CreateKnowledgeObjectInput,
  ) {
    return this.knowledgeService.createObject(
      input,
    );
  }

  @Patch('objects/:objectId')
  updateObject(
    @Param('objectId') objectId: string,
    @Body()
    input: UpdateKnowledgeObjectInput,
  ) {
    try {
      return this.knowledgeService.updateObject(
        objectId,
        input,
      );
    } catch (error) {
      this.handleKnowledgeError(error);
    }
  }

  @Get('objects/:objectId/versions')
  getVersions(
    @Param('objectId') objectId: string,
  ) {
    try {
      return this.knowledgeService.getVersions(
        objectId,
      );
    } catch (error) {
      this.handleKnowledgeError(error);
    }
  }

  @Get('relations')
  getRelations(
    @Query('objectId') objectId?: string,
  ) {
    try {
      return this.knowledgeService.getRelations(
        objectId,
      );
    } catch (error) {
      this.handleKnowledgeError(error);
    }
  }

  @Post('relations')
  createRelation(
    @Body()
    input: CreateKnowledgeRelationInput,
  ) {
    try {
      return this.knowledgeService.createRelation(
        input,
      );
    } catch (error) {
      this.handleKnowledgeError(error);
    }
  }

  private handleKnowledgeError(
    error: unknown,
  ): never {
    if (
      error instanceof
      KnowledgeObjectNotFoundError
    ) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Knowledge Object Not Found',
        message: error.message,
      });
    }

    if (
      error instanceof
      InvalidKnowledgeRelationError
    ) {
      throw new Error(error.message);
    }

    throw error;
  }
}
