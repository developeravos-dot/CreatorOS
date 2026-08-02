export interface ApiErrorDetails {
  status: number;
  url: string;
  method: string;
  payload?: unknown;
  code?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly method: string;
  readonly payload?: unknown;
  readonly code?: string;

  constructor(
    message: string,
    details: ApiErrorDetails,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = details.status;
    this.url = details.url;
    this.method = details.method;
    this.payload = details.payload;
    this.code = details.code;
  }
}

export function isApiError(
  error: unknown,
): error is ApiError {
  return error instanceof ApiError;
}
