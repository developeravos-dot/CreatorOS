import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CreateImageGenerationJobDto } from './dto/create-image-generation-job.dto';
import { ReviewGeneratedImageDto } from './dto/review-generated-image.dto';

import { ImageProviderAdapterService } from './image-provider-adapter.service';

@Controller(
  'enterprise/infinite-universe/image-providers',
)
export class ImageProviderAdapterController {
  constructor(
    private readonly service:
      ImageProviderAdapterService,
  ) {}

  @Get('status')
  getStatus() {
    return this.service
      .getStatus();
  }

  @Get()
  getProviders() {
    return this.service
      .getProviders();
  }

  @Post('jobs')
  createJob(
    @Body()
    dto: CreateImageGenerationJobDto,
  ) {
    return this.service
      .createAndExecuteJob(dto);
  }

  @Post('review')
  review(
    @Body()
    dto: ReviewGeneratedImageDto,
  ) {
    return this.service
      .reviewAsset(dto);
  }

  @Get('world/:worldId/jobs')
  async getJobs(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      jobs:
        await this.service
          .getJobs(worldId),
    };
  }
}
