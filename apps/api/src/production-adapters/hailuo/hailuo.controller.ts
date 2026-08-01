import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../../modules/core-v1/auth/public.decorator';
import { HailuoAdapter } from './hailuo.adapter';
import {
  CreateHailuoVideoRequest,
  HailuoWaitOptions,
} from './hailuo.contracts';

@Public()
@Controller('enterprise/production-adapters/hailuo')
export class HailuoController {
  constructor(private readonly hailuo: HailuoAdapter) {}

  @Get('status')
  status() {
    return {
      success: true,
      adapter: this.hailuo.status(),
    };
  }

  @Post('tasks')
  createTask(@Body() request: CreateHailuoVideoRequest) {
    return this.hailuo.createVideoTask(request);
  }

  @Get('tasks/:taskId')
  queryTask(@Param('taskId') taskId: string) {
    return this.hailuo.queryTask(taskId);
  }

  @Get('files/:fileId')
  retrieveFile(@Param('fileId') fileId: string) {
    return this.hailuo.retrieveFile(fileId);
  }

  @Post('generate-and-wait')
  generateAndWait(
    @Body()
    body: {
      request: CreateHailuoVideoRequest;
      options?: HailuoWaitOptions;
    },
  ) {
    return this.hailuo.generateAndWait(
      body.request,
      body.options,
    );
  }

  @Post('download')
  download(
    @Body()
    body: {
      downloadUrl: string;
      outputDirectory?: string;
      filename?: string;
    },
  ) {
    return this.hailuo.downloadVideo(
      body.downloadUrl,
      body.outputDirectory,
      body.filename,
    );
  }

  @Post('generate-wait-download')
  generateWaitDownload(
    @Body()
    body: {
      request: CreateHailuoVideoRequest;
      options?: HailuoWaitOptions & {
        outputDirectory?: string;
        filename?: string;
      };
    },
  ) {
    return this.hailuo.generateWaitAndDownload(
      body.request,
      body.options,
    );
  }

  @Post('callback')
  callback(
    @Body()
    payload: {
      challenge?: string;
      task_id?: string;
      status?: string;
      file_id?: string;
    },
    @Query('token') token?: string,
  ) {
    const configuredToken =
      process.env.HAILUO_CALLBACK_TOKEN?.trim();

    if (configuredToken && token !== configuredToken) {
      return {
        success: false,
        accepted: false,
      };
    }

    if (payload.challenge) {
      return {
        challenge: payload.challenge,
      };
    }

    return {
      success: true,
      accepted: true,
      taskId: payload.task_id,
      status: payload.status,
      fileId: payload.file_id,
    };
  }
}