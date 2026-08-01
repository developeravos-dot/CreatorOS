import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import {
  CreateHailuoVideoRequest,
  HailuoCompletedVideo,
  HailuoCreateTaskResponse,
  HailuoQueryTaskResponse,
  HailuoRetrieveFileResponse,
  HailuoWaitOptions,
} from './hailuo.contracts';

@Injectable()
export class HailuoAdapter {
  private readonly baseUrl = (
    process.env.HAILUO_API_BASE_URL?.trim() ||
    'https://api.minimax.io/v1'
  ).replace(/\/+$/, '');

  status() {
    const enabled = this.readBoolean(
      process.env.PRODUCTION_TOOL_HAILUO_ENABLED,
      false,
    );

    const configured = Boolean(
      process.env.HAILUO_API_KEY?.trim(),
    );

    return {
      id: 'hailuo',
      provider: 'MiniMax Hailuo',
      capability: 'video-generation',
      enabled,
      configured,
      available: enabled && configured,
      model:
        process.env.HAILUO_MODEL?.trim() ||
        'MiniMax-Hailuo-2.3',
      baseUrl: this.baseUrl,
      execution: 'real-api',
      nodeVersion: process.version,
      fetchAvailable: typeof fetch === 'function',
      workflow: [
        'create-task',
        'poll-task',
        'retrieve-file',
        'download-video',
      ],
    };
  }

  async createVideoTask(
    request: CreateHailuoVideoRequest,
  ): Promise<HailuoCreateTaskResponse> {
    this.assertAvailable();
    this.validateRequest(request);

    const payload: Record<string, unknown> = {
      prompt: request.prompt.trim(),
      model:
        request.model ??
        process.env.HAILUO_MODEL?.trim() ??
        'MiniMax-Hailuo-2.3',
      duration: request.duration ?? 6,
      resolution: request.resolution ?? '1080P',
      prompt_optimizer:
        request.promptOptimizer ?? true,
    };

    if (request.firstFrameImage?.trim()) {
      payload.first_frame_image =
        request.firstFrameImage.trim();
    }

    if (request.lastFrameImage?.trim()) {
      payload.last_frame_image =
        request.lastFrameImage.trim();
    }

    if (request.callbackUrl?.trim()) {
      payload.callback_url =
        request.callbackUrl.trim();
    }

    const response =
      await this.request<HailuoCreateTaskResponse>(
        `${this.baseUrl}/video_generation`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );

    if (!response.task_id?.trim()) {
      throw new BadGatewayException({
        message: 'Hailuo did not return a task_id.',
        providerResponse: response,
      });
    }

    return response;
  }

  async queryTask(
    taskId: string,
  ): Promise<HailuoQueryTaskResponse> {
    this.assertAvailable();

    if (!taskId?.trim()) {
      throw new BadRequestException(
        'Hailuo taskId is required.',
      );
    }

    const url = new URL(
      `${this.baseUrl}/query/video_generation`,
    );

    url.searchParams.set(
      'task_id',
      taskId.trim(),
    );

    return this.request<HailuoQueryTaskResponse>(
      url.toString(),
      {
        method: 'GET',
      },
    );
  }

  async retrieveFile(
    fileId: string,
  ): Promise<HailuoRetrieveFileResponse> {
    this.assertAvailable();

    if (!fileId?.trim()) {
      throw new BadRequestException(
        'Hailuo fileId is required.',
      );
    }

    const url = new URL(
      `${this.baseUrl}/files/retrieve`,
    );

    url.searchParams.set(
      'file_id',
      fileId.trim(),
    );

    const result =
      await this.request<HailuoRetrieveFileResponse>(
        url.toString(),
        {
          method: 'GET',
        },
      );

    if (!result.file?.download_url?.trim()) {
      throw new BadGatewayException({
        message:
          'Hailuo did not return a download URL.',
        providerResponse: result,
      });
    }

    return result;
  }

  async generateAndWait(
    request: CreateHailuoVideoRequest,
    options: HailuoWaitOptions = {},
  ): Promise<HailuoCompletedVideo> {
    const task = await this.createVideoTask(request);

    const pollingIntervalMs =
      this.readPositiveNumber(
        options.pollingIntervalMs,
        process.env.HAILUO_POLL_INTERVAL_MS,
        10_000,
        5_000,
      );

    const timeoutMs =
      this.readPositiveNumber(
        options.timeoutMs,
        process.env.HAILUO_TIMEOUT_MS,
        900_000,
        pollingIntervalMs,
      );

    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      await this.sleep(pollingIntervalMs);

      const taskStatus =
        await this.queryTask(task.task_id);

      if (taskStatus.status === 'Fail') {
        throw new BadGatewayException({
          message:
            taskStatus.error_message ||
            taskStatus.base_resp?.status_msg ||
            'Hailuo video generation failed.',
          taskId: task.task_id,
          providerResponse: taskStatus,
        });
      }

      if (taskStatus.status === 'Success') {
        if (!taskStatus.file_id?.trim()) {
          throw new BadGatewayException({
            message:
              'Hailuo task succeeded without a file_id.',
            taskId: task.task_id,
            providerResponse: taskStatus,
          });
        }

        const file = await this.retrieveFile(
          taskStatus.file_id,
        );

        return {
          taskId: task.task_id,
          fileId: taskStatus.file_id,
          downloadUrl:
            file.file.download_url,
          filename:
            file.file.filename,
          bytes:
            file.file.bytes,
          width:
            taskStatus.video_width,
          height:
            taskStatus.video_height,
        };
      }
    }

    throw new ServiceUnavailableException({
      message:
        `Hailuo task timed out after ${timeoutMs}ms.`,
      taskId: task.task_id,
      timeoutMs,
      pollingIntervalMs,
    });
  }

  async downloadVideo(
    downloadUrl: string,
    outputDirectory?: string,
    filename?: string,
  ) {
    this.assertAvailable();

    if (!downloadUrl?.trim()) {
      throw new BadRequestException(
        'downloadUrl is required.',
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(downloadUrl.trim());
    } catch {
      throw new BadRequestException({
        message:
          'Hailuo download URL is invalid.',
        downloadUrl,
      });
    }

    const directory = resolve(
      outputDirectory?.trim() ||
        process.env.HAILUO_OUTPUT_DIR?.trim() ||
        'storage/production/hailuo',
    );

    try {
      await mkdir(directory, {
        recursive: true,
      });
    } catch (error) {
      throw new ServiceUnavailableException({
        message:
          'Unable to create the Hailuo output directory.',
        directory,
        error: this.serializeError(error),
      });
    }

    const sourceName =
      filename?.trim() ||
      basename(parsedUrl.pathname) ||
      `hailuo-${Date.now()}.mp4`;

    const safeName =
      this.sanitizeFilename(sourceName);

    const finalName =
      safeName.toLowerCase().endsWith('.mp4')
        ? safeName
        : `${safeName}.mp4`;

    let response: Response;

    try {
      response = await fetch(
        parsedUrl.toString(),
        {
          method: 'GET',
          redirect: 'follow',
        },
      );
    } catch (error) {
      throw new ServiceUnavailableException({
        message:
          'Unable to download the generated Hailuo video.',
        downloadUrl:
          parsedUrl.toString(),
        nodeVersion:
          process.version,
        error:
          this.serializeError(error),
      });
    }

    if (!response.ok) {
      const responseText =
        await this.safeReadText(response);

      throw new BadGatewayException({
        message:
          `Hailuo video download failed: HTTP ${response.status}`,
        status:
          response.status,
        statusText:
          response.statusText,
        providerResponse:
          responseText,
      });
    }

    let bytes: Buffer;

    try {
      bytes = Buffer.from(
        await response.arrayBuffer(),
      );
    } catch (error) {
      throw new BadGatewayException({
        message:
          'Unable to read the downloaded Hailuo video.',
        error:
          this.serializeError(error),
      });
    }

    if (bytes.length === 0) {
      throw new BadGatewayException(
        'Hailuo returned an empty video file.',
      );
    }

    const outputPath = resolve(
      directory,
      finalName,
    );

    try {
      await writeFile(
        outputPath,
        bytes,
      );
    } catch (error) {
      throw new ServiceUnavailableException({
        message:
          'Unable to save the generated Hailuo video.',
        outputPath,
        error:
          this.serializeError(error),
      });
    }

    return {
      success: true,
      outputPath,
      filename: finalName,
      bytes: bytes.length,
    };
  }

  async generateWaitAndDownload(
    request: CreateHailuoVideoRequest,
    options: HailuoWaitOptions & {
      outputDirectory?: string;
      filename?: string;
    } = {},
  ) {
    const completed =
      await this.generateAndWait(
        request,
        options,
      );

    const downloaded =
      await this.downloadVideo(
        completed.downloadUrl,
        options.outputDirectory,
        options.filename ??
          completed.filename,
      );

    return {
      success: true,
      provider: 'hailuo',
      completed,
      downloaded,
    };
  }

  private async request<T>(
    url: string,
    init: RequestInit,
  ): Promise<T> {
    this.assertFetchAvailable();

    let response: Response;

    try {
      response = await fetch(url, {
        ...init,
        headers: {
          Authorization:
            `Bearer ${process.env.HAILUO_API_KEY?.trim()}`,
          'Content-Type':
            'application/json',
          Accept:
            'application/json',
          ...(init.headers ?? {}),
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException({
        message:
          'Unable to connect to the Hailuo API.',
        url,
        method:
          init.method ?? 'GET',
        nodeVersion:
          process.version,
        error:
          this.serializeError(error),
      });
    }

    const text =
      await this.safeReadText(response);

    let payload: unknown = {};

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = {
          raw: text,
        };
      }
    }

    if (!response.ok) {
      throw new BadGatewayException({
        message:
          `Hailuo API request failed: HTTP ${response.status}`,
        status:
          response.status,
        statusText:
          response.statusText,
        url,
        providerResponse:
          payload,
      });
    }

    const baseResponse = (
      payload as {
        base_resp?: {
          status_code?: number;
          status_msg?: string;
        };
      }
    ).base_resp;

    if (
      typeof baseResponse?.status_code ===
        'number' &&
      baseResponse.status_code !== 0
    ) {
      throw new BadGatewayException({
        message:
          baseResponse.status_msg ||
          'Hailuo API returned an error.',
        statusCode:
          baseResponse.status_code,
        url,
        providerResponse:
          payload,
      });
    }

    return payload as T;
  }

  private assertAvailable(): void {
    const currentStatus = this.status();

    if (!currentStatus.enabled) {
      throw new ServiceUnavailableException(
        'Hailuo integration is disabled. Set PRODUCTION_TOOL_HAILUO_ENABLED=true.',
      );
    }

    if (!currentStatus.configured) {
      throw new ServiceUnavailableException(
        'Hailuo API key is missing. Set HAILUO_API_KEY.',
      );
    }

    this.assertFetchAvailable();
  }

  private assertFetchAvailable(): void {
    if (typeof fetch !== 'function') {
      throw new ServiceUnavailableException({
        message:
          'The current Node.js version does not provide the Fetch API.',
        nodeVersion:
          process.version,
        required:
          'Node.js 18 or newer',
      });
    }
  }

  private validateRequest(
    request: CreateHailuoVideoRequest,
  ): void {
    if (!request) {
      throw new BadRequestException(
        'Video request is required.',
      );
    }

    if (!request.prompt?.trim()) {
      throw new BadRequestException(
        'Video prompt is required.',
      );
    }

    if (request.prompt.trim().length > 2000) {
      throw new BadRequestException(
        'Video prompt must not exceed 2000 characters.',
      );
    }

    if (
      request.duration === 10 &&
      request.resolution === '1080P'
    ) {
      throw new BadRequestException(
        '10-second generation must use 768P.',
      );
    }

    if (
      request.lastFrameImage?.trim() &&
      !request.firstFrameImage?.trim()
    ) {
      throw new BadRequestException(
        'lastFrameImage requires firstFrameImage.',
      );
    }
  }

  private readBoolean(
    value: string | undefined,
    fallback: boolean,
  ): boolean {
    if (value === undefined) {
      return fallback;
    }

    return [
      '1',
      'true',
      'yes',
      'on',
    ].includes(
      value.trim().toLowerCase(),
    );
  }

  private readPositiveNumber(
    directValue: number | undefined,
    environmentValue: string | undefined,
    fallback: number,
    minimum: number,
  ): number {
    const candidate =
      directValue ??
      Number(environmentValue ?? fallback);

    if (
      !Number.isFinite(candidate) ||
      candidate <= 0
    ) {
      return Math.max(
        fallback,
        minimum,
      );
    }

    return Math.max(
      Math.floor(candidate),
      minimum,
    );
  }

  private sanitizeFilename(
    value: string,
  ): string {
    const sanitized = value
      .replace(
        /[<>:"/\\|?*\u0000-\u001F]/g,
        '-',
      )
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^\.+/, '')
      .slice(0, 150);

    return (
      sanitized ||
      `hailuo-${Date.now()}.mp4`
    );
  }

  private async safeReadText(
    response: Response,
  ): Promise<string> {
    try {
      return await response.text();
    } catch (error) {
      return JSON.stringify({
        message:
          'Unable to read provider response.',
        error:
          this.serializeError(error),
      });
    }
  }

  private serializeError(
    error: unknown,
  ): Record<string, unknown> {
    if (!(error instanceof Error)) {
      return {
        message: String(error),
      };
    }

    const result: Record<string, unknown> = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    const errorWithCause =
      error as Error & {
        cause?: unknown;
        code?: unknown;
        errno?: unknown;
        syscall?: unknown;
        hostname?: unknown;
      };

    if (
      errorWithCause.cause !== undefined
    ) {
      result.cause =
        errorWithCause.cause instanceof Error
          ? {
              name:
                errorWithCause.cause.name,
              message:
                errorWithCause.cause.message,
              stack:
                errorWithCause.cause.stack,
            }
          : String(
              errorWithCause.cause,
            );
    }

    if (
      errorWithCause.code !== undefined
    ) {
      result.code =
        errorWithCause.code;
    }

    if (
      errorWithCause.errno !== undefined
    ) {
      result.errno =
        errorWithCause.errno;
    }

    if (
      errorWithCause.syscall !== undefined
    ) {
      result.syscall =
        errorWithCause.syscall;
    }

    if (
      errorWithCause.hostname !== undefined
    ) {
      result.hostname =
        errorWithCause.hostname;
    }

    return result;
  }

  private sleep(
    milliseconds: number,
  ): Promise<void> {
    return new Promise(
      (resolvePromise) => {
        setTimeout(
          resolvePromise,
          milliseconds,
        );
      },
    );
  }
}