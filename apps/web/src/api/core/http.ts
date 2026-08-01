export interface HttpRequestOptions extends RequestInit {
  timeout?: number;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`HTTP ${status}`);
  }
}

export async function http<T>(
  input: string,
  options: HttpRequestOptions = {},
): Promise<T> {

  const controller = new AbortController();

  const timeout = window.setTimeout(
    () => controller.abort(),
    options.timeout ?? 30000,
  );

  try {

    const response = await fetch(input,{
      ...options,
      signal:controller.signal,
    });

    const text = await response.text();

    const data = text ? JSON.parse(text) : null;

    if(!response.ok){
      throw new HttpError(response.status,data);
    }

    return data as T;

  } finally{

    clearTimeout(timeout);

  }

}
