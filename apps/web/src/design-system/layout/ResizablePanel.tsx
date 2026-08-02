import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ResizablePanelProps {
  primary: ReactNode;
  secondary: ReactNode;
  storageKey: string;
  initialSize?: number;
  minimumSize?: number;
  maximumSize?: number;
  collapsedSize?: number;
  className?: string;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

function readStoredSize(
  storageKey: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  try {
    const value =
      localStorage.getItem(
        storageKey,
      );

    if (!value) {
      return fallback;
    }

    const parsed =
      Number(value);

    if (
      !Number.isFinite(parsed)
    ) {
      return fallback;
    }

    return clamp(
      parsed,
      minimum,
      maximum,
    );
  } catch {
    return fallback;
  }
}

export default function ResizablePanel({
  primary,
  secondary,
  storageKey,
  initialSize = 360,
  minimumSize = 240,
  maximumSize = 720,
  collapsedSize = 0,
  className = "",
}: ResizablePanelProps) {
  const containerRef =
    useRef<HTMLElement | null>(
      null,
    );

  const [
    size,
    setSize,
  ] = useState(
    () =>
      readStoredSize(
        storageKey,
        initialSize,
        minimumSize,
        maximumSize,
      ),
  );

  const [
    previousSize,
    setPreviousSize,
  ] = useState(size);

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        String(size),
      );
    } catch {
      // Keep layout state in memory.
    }
  }, [
    size,
    storageKey,
  ]);

  const toggleCollapsed =
    useCallback((): void => {
      setCollapsed(
        (current) => {
          if (current) {
            setSize(
              clamp(
                previousSize,
                minimumSize,
                maximumSize,
              ),
            );

            return false;
          }

          setPreviousSize(
            size,
          );

          return true;
        },
      );
    }, [
      maximumSize,
      minimumSize,
      previousSize,
      size,
    ]);

  const handlePointerDown =
    useCallback(
      (
        event:
          React.PointerEvent<
            HTMLDivElement
          >,
      ): void => {
        event.preventDefault();

        const startX =
          event.clientX;

        const startSize =
          size;

        const handlePointerMove =
          (
            moveEvent:
              PointerEvent,
          ): void => {
            const nextSize =
              clamp(
                startSize +
                  (
                    moveEvent.clientX -
                    startX
                  ),
                minimumSize,
                maximumSize,
              );

            setCollapsed(false);
            setSize(nextSize);
          };

        const handlePointerUp =
          (): void => {
            window.removeEventListener(
              "pointermove",
              handlePointerMove,
            );

            window.removeEventListener(
              "pointerup",
              handlePointerUp,
            );
          };

        window.addEventListener(
          "pointermove",
          handlePointerMove,
        );

        window.addEventListener(
          "pointerup",
          handlePointerUp,
        );
      },
      [
        maximumSize,
        minimumSize,
        size,
      ],
    );

  const appliedSize =
    collapsed
      ? collapsedSize
      : size;

  return (
    <section
      ref={containerRef}
      className={[
        "cos-resizable-panel",
        collapsed
          ? "cos-resizable-panel--collapsed"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="cos-resizable-panel__primary"
        style={{
          width:
            appliedSize,
          minWidth:
            appliedSize,
        }}
      >
        {primary}
      </div>

      <div
        className="cos-resizable-panel__divider"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
        tabIndex={0}
        onPointerDown={
          handlePointerDown
        }
        onKeyDown={(
          event,
        ) => {
          if (
            event.key ===
            "ArrowLeft"
          ) {
            event.preventDefault();

            setCollapsed(false);

            setSize(
              (current) =>
                clamp(
                  current - 20,
                  minimumSize,
                  maximumSize,
                ),
            );
          }

          if (
            event.key ===
            "ArrowRight"
          ) {
            event.preventDefault();

            setCollapsed(false);

            setSize(
              (current) =>
                clamp(
                  current + 20,
                  minimumSize,
                  maximumSize,
                ),
            );
          }
        }}
      >
        <button
          type="button"
          aria-label={
            collapsed
              ? "Expand primary panel"
              : "Collapse primary panel"
          }
          onClick={
            toggleCollapsed
          }
        >
          {collapsed
            ? "›"
            : "‹"}
        </button>
      </div>

      <div className="cos-resizable-panel__secondary">
        {secondary}
      </div>
    </section>
  );
}
