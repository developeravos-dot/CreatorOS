export interface TimeoutController {
  signal: AbortSignal;
  abort: (
    reason?: unknown,
  ) => void;
  dispose: () => void;
}

export function createTimeoutController(
  timeoutMs: number,
  parentSignal?: AbortSignal,
): TimeoutController {
  const controller =
    new AbortController();

  const normalizedTimeout =
    Math.max(0, timeoutMs);

  const timeoutId =
    globalThis.setTimeout(
      () => {
        controller.abort(
          new DOMException(
            `Request timed out after ${normalizedTimeout}ms.`,
            "TimeoutError",
          ),
        );
      },
      normalizedTimeout,
    );

  const handleParentAbort =
    () => {
      controller.abort(
        parentSignal?.reason,
      );
    };

  if (parentSignal?.aborted) {
    handleParentAbort();
  } else {
    parentSignal?.addEventListener(
      "abort",
      handleParentAbort,
      {
        once: true,
      },
    );
  }

  function dispose(): void {
    globalThis.clearTimeout(
      timeoutId,
    );

    parentSignal?.removeEventListener(
      "abort",
      handleParentAbort,
    );
  }

  return {
    signal: controller.signal,

    abort(reason?: unknown) {
      controller.abort(reason);
      dispose();
    },

    dispose,
  };
}

export async function withTimeout<T>(
  operation: (
    signal: AbortSignal,
  ) => Promise<T>,
  timeoutMs: number,
  parentSignal?: AbortSignal,
): Promise<T> {
  const timeout =
    createTimeoutController(
      timeoutMs,
      parentSignal,
    );

  try {
    return await operation(
      timeout.signal,
    );
  } finally {
    timeout.dispose();
  }
}
