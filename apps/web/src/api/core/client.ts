import {
  http,
  type HttpRequestOptions,
} from "./http";

export interface ApiClient {
  request<T>(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<T>;

  get<T>(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<T>;

  post<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;

  put<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;

  patch<T>(
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;

  delete<T>(
    path: string,
    options?: HttpRequestOptions,
  ): Promise<T>;
}

function joinPaths(
  prefix: string,
  path: string,
): string {
  const normalizedPrefix = prefix
    ? `/${prefix.replace(/^\/+|\/+$/g, "")}`
    : "";

  const normalizedPath = path
    ? `/${path.replace(/^\/+/, "")}`
    : "";

  return `${normalizedPrefix}${normalizedPath}`;
}

export function createApiClient(
  prefix = "",
): ApiClient {
  const resolvePath = (path: string) =>
    joinPaths(prefix, path);

  return {
    request<T>(
      path: string,
      options?: HttpRequestOptions,
    ) {
      return http<T>(
        resolvePath(path),
        options,
      );
    },

    get<T>(
      path: string,
      options?: HttpRequestOptions,
    ) {
      return http<T>(
        resolvePath(path),
        {
          ...options,
          method: "GET",
        },
      );
    },

    post<T>(
      path: string,
      body?: unknown,
      options?: HttpRequestOptions,
    ) {
      return http<T>(
        resolvePath(path),
        {
          ...options,
          method: "POST",
          body,
        },
      );
    },

    put<T>(
      path: string,
      body?: unknown,
      options?: HttpRequestOptions,
    ) {
      return http<T>(
        resolvePath(path),
        {
          ...options,
          method: "PUT",
          body,
        },
      );
    },

    patch<T>(
      path: string,
      body?: unknown,
      options?: HttpRequestOptions,
    ) {
      return http<T>(
        resolvePath(path),
        {
          ...options,
          method: "PATCH",
          body,
        },
      );
    },

    delete<T>(
      path: string,
      options?: HttpRequestOptions,
    ) {
      return http<T>(
        resolvePath(path),
        {
          ...options,
          method: "DELETE",
        },
      );
    },
  };
}

export const apiClient =
  createApiClient();

export const creatorClient =
  createApiClient("/creator");

export const enterpriseClient =
  createApiClient("/enterprise");
