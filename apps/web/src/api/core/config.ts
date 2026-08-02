export interface ApiConfiguration {
  baseUrl: string;
  timeoutMs: number;
}

const DEFAULT_API_BASE_URL = "/api/v1";
const DEFAULT_TIMEOUT_MS = 15_000;

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmed.replace(/\/+$/, "");
}

function resolveConfiguredBaseUrl(): string {
  const environmentUrl =
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_BASE_URL;

  if (environmentUrl?.trim()) {
    const normalizedEnvironmentUrl =
      normalizeBaseUrl(environmentUrl);

    return normalizedEnvironmentUrl.endsWith("/api/v1")
      ? normalizedEnvironmentUrl
      : `${normalizedEnvironmentUrl}/api/v1`;
  }

  const storedUrl =
    globalThis.localStorage?.getItem(
      "creatoros-api-url",
    );

  if (storedUrl?.trim()) {
    const normalizedStoredUrl =
      normalizeBaseUrl(storedUrl);

    return normalizedStoredUrl.endsWith("/api/v1")
      ? normalizedStoredUrl
      : `${normalizedStoredUrl}/api/v1`;
  }

  return DEFAULT_API_BASE_URL;
}

let configuration: ApiConfiguration = {
  baseUrl: resolveConfiguredBaseUrl(),
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

export function getApiConfiguration(): ApiConfiguration {
  return {
    ...configuration,
  };
}

export function configureApi(
  update: Partial<ApiConfiguration>,
): ApiConfiguration {
  configuration = {
    ...configuration,
    ...update,
    baseUrl:
      update.baseUrl !== undefined
        ? normalizeBaseUrl(update.baseUrl)
        : configuration.baseUrl,
  };

  return getApiConfiguration();
}

export function resetApiConfiguration(): void {
  configuration = {
    baseUrl: resolveConfiguredBaseUrl(),
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };
}

export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${configuration.baseUrl}${normalizedPath}`;
}
