export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  maximumDelayMs?: number;
  shouldRetry?: (
    error: unknown,
    attempt: number,
  ) => boolean;
  signal?: AbortSignal;
}

function abortError(): DOMException {
  return new DOMException(
    "The operation was aborted.",
    "AbortError",
  );
}

function wait(
  delayMs: number,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(
      abortError(),
    );
  }

  return new Promise<void>(
    (resolve, reject) => {
      const timeoutId =
        globalThis.setTimeout(
          resolve,
          delayMs,
        );

      const handleAbort = () => {
        globalThis.clearTimeout(
          timeoutId,
        );

        reject(abortError());
      };

      signal?.addEventListener(
        "abort",
        handleAbort,
        {
          once: true,
        },
      );
    },
  );
}

export async function retry<T>(
  operation: (
    attempt: number,
  ) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    retries = 2,
    delayMs = 250,
    backoffMultiplier = 2,
    maximumDelayMs = 4_000,
    shouldRetry = () => true,
    signal,
  } = options;

  let attempt = 0;
  let currentDelay =
    Math.max(0, delayMs);

  while (true) {
    if (signal?.aborted) {
      throw abortError();
    }

    try {
      return await operation(
        attempt,
      );
    } catch (error: unknown) {
      const canRetry =
        attempt < retries &&
        shouldRetry(
          error,
          attempt,
        );

      if (!canRetry) {
        throw error;
      }

      await wait(
        currentDelay,
        signal,
      );

      currentDelay = Math.min(
        maximumDelayMs,
        Math.max(
          0,
          currentDelay *
            backoffMultiplier,
        ),
      );

      attempt += 1;
    }
  }
}
