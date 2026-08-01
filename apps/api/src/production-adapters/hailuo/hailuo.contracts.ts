export type HailuoResolution = '768P' | '1080P';
export type HailuoTaskStatus =
  | 'Preparing'
  | 'Queueing'
  | 'Processing'
  | 'Success'
  | 'Fail';

export interface CreateHailuoVideoRequest {
  prompt: string;
  model?: 'MiniMax-Hailuo-2.3' | 'MiniMax-Hailuo-2.3-Fast' | 'MiniMax-Hailuo-02';
  duration?: 6 | 10;
  resolution?: HailuoResolution;
  firstFrameImage?: string;
  lastFrameImage?: string;
  promptOptimizer?: boolean;
  callbackUrl?: string;
}

export interface HailuoCreateTaskResponse {
  task_id: string;
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

export interface HailuoQueryTaskResponse {
  task_id: string;
  status: HailuoTaskStatus;
  file_id?: string;
  video_width?: number;
  video_height?: number;
  error_message?: string;
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

export interface HailuoRetrieveFileResponse {
  file: {
    file_id: string;
    bytes?: number;
    created_at?: number;
    filename?: string;
    purpose?: string;
    download_url: string;
  };
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

export interface HailuoWaitOptions {
  pollingIntervalMs?: number;
  timeoutMs?: number;
}

export interface HailuoCompletedVideo {
  taskId: string;
  fileId: string;
  downloadUrl: string;
  filename?: string;
  bytes?: number;
  width?: number;
  height?: number;
}