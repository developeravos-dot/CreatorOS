import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { KnowledgeApplicationService } from '../../application/services';

@Controller('knowledge')
export class KnowledgeController {
  constructor(
    private readonly service: KnowledgeApplicationService,
  ) {}

  @Post('nodes')
  createNode(
    @Body()
    data: Parameters<KnowledgeApplicationService['createNode']>[0],
  ) {
    return this.service.createNode(data);
  }

  @Get('nodes')
  listNodes() {
    return this.service.listNodes({});
  }

  @Get('nodes/:id')
  getNode(
    @Param('id')
    id: string,
  ) {
    return this.service.getNode(id);
  }

  @Patch('nodes/:id')
  updateNode(
    @Param('id')
    id: string,
    @Body()
    data: Parameters<KnowledgeApplicationService['updateNode']>[1],
  ) {
    return this.service.updateNode(
      id,
      data,
    );
  }

  @Delete('nodes/:id')
  removeNode(
    @Param('id')
    id: string,
  ) {
    return this.service.removeNode(id);
  }

  @Post('edges')
  createEdge(
    @Body()
    data: Parameters<KnowledgeApplicationService['createEdge']>[0],
  ) {
    return this.service.createEdge(data);
  }

  @Get('edges')
  listEdges() {
    return this.service.listEdges({});
  }

  @Get('edges/:id')
  getEdge(
    @Param('id')
    id: string,
  ) {
    return this.service.getEdge(id);
  }

  @Patch('edges/:id')
  updateEdge(
    @Param('id')
    id: string,
    @Body()
    data: Parameters<KnowledgeApplicationService['updateEdge']>[1],
  ) {
    return this.service.updateEdge(
      id,
      data,
    );
  }

  @Delete('edges/:id')
  removeEdge(
    @Param('id')
    id: string,
  ) {
    return this.service.removeEdge(id);
  }
}