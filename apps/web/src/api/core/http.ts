import {
  getApiConfiguration,
  resolveApiUrl,
} from "./config";
import { ApiError } from "./errors";

export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string | string[];
  error?: string;
}

export interface HttpRequestOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeoutMs?: number;
  unwrapData?: boolean;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function extractMessage(
  payload: unknown,
  fallback: string,
): string {
  if (!isRecord(payload)) {
    return fallback;
  }

  const message = payload.message;

  if (Array.isArray(message)) {
    const messages = message.filter(
      (item): item is string =>
        typeof item === "string",
    );

    if (messages.length > 0) {
      return messages.join("، ");
    }
  }

  if (
    typeof message === "string" &&
    message.trim()
  ) {
    return message;
  }

  if (
    typeof payload.error === "string" &&
    payload.error.trim()
  ) {
    return payload.error;
  }

  return fallback;
}

function unwrapResponse<T>(
  payload: unknown,
  unwrapData: boolean,
): T {
  if (!unwrapData || !isRecord(payload)) {
    return payload as T;
  }

  if (
    payload.success === false
  ) {
    throw new ApiError(
      extractMessage(
        payload,
        "أعاد الخادم استجابة غير ناجحة.",
      ),
      {
        status: 200,
        url: "response-validation",
        method: "UNKNOWN",
        payload,
        code: "UNSUCCESSFUL_RESPONSE",
      },
    );
  }

  if (
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export async function http<T>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<T> {
  const {
    body,
    timeoutMs =
      getApiConfiguration().timeoutMs,
    unwrapData = true,
    headers,
    signal,
    ...requestOptions
  } = options;

  const url = resolveApiUrl(path);
  const method =
    requestOptions.method?.toUpperCase() ?? "GET";

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(
    () => controller.abort(),
    timeoutMs,
  );

  const abortFromParent = () =>
    controller.abort();

  signal?.addEventListener(
    "abort",
    abortFromParent,
    { once: true },
  );

  let response: Response;

  try {
    response = await fetch(url, {
      ...requestOptions,
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined
          ? {
              "Content-Type":
                "application/json; charset=utf-8",
            }
          : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : typeof body === "string" ||
              body instanceof FormData ||
              body instanceof Blob
            ? body
            : JSON.stringify(body),
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new ApiError(
        "انتهت مهلة الاتصال بخادم CreatorOS.",
        {
          status: 0,
          url,
          method,
          code: "REQUEST_TIMEOUT",
        },
      );
    }

    throw new ApiError(
      error instanceof Error
        ? `تعذر الاتصال بخادم CreatorOS: ${error.message}`
        : "تعذر الاتصال بخادم CreatorOS.",
      {
        status: 0,
        url,
        method,
        payload: error,
        code: "NETWORK_ERROR",
      },
    );
  } finally {
    globalThis.clearTimeout(timeoutId);

    signal?.removeEventListener(
      "abort",
      abortFromParent,
    );
  }

  const rawBody = await response.text();

  let payload: unknown = null;

  if (rawBody.trim()) {
    const contentType =
      response.headers.get("content-type") ?? "";

    if (
      contentType.includes("application/json")
    ) {
      try {
        payload = JSON.parse(rawBody) as unknown;
      } catch {
        throw new ApiError(
          "أعاد الخادم JSON غير صالح.",
          {
            status: response.status,
            url,
            method,
            payload: rawBody.slice(0, 500),
            code: "INVALID_JSON",
          },
        );
      }
    } else {
      payload = rawBody;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractMessage(
        payload,
        `فشل الطلب برمز HTTP ${response.status}.`,
      ),
      {
        status: response.status,
        url,
        method,
        payload,
        code: "HTTP_ERROR",
      },
    );
  }

  if (
    response.status === 204 ||
    payload === null
  ) {
    return undefined as T;
  }

  return unwrapResponse<T>(
    payload,
    unwrapData,
  );
}
