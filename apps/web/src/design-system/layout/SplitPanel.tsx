import type {
  ReactNode,
} from "react";

export type SplitPanelDirection =
  | "horizontal"
  | "vertical";

interface SplitPanelProps {
  primary: ReactNode;
  secondary: ReactNode;
  direction?: SplitPanelDirection;
  gap?: "none" | "sm" | "md" | "lg";
  primaryMinWidth?: number;
  secondaryMinWidth?: number;
  className?: string;
}

export default function SplitPanel({
  primary,
  secondary,
  direction = "horizontal",
  gap = "md",
  primaryMinWidth = 0,
  secondaryMinWidth = 0,
  className = "",
}: SplitPanelProps) {
  return (
    <section
      className={[
        "cos-split-panel",
        `cos-split-panel--${direction}`,
        `cos-split-panel--gap-${gap}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="cos-split-panel__primary"
        style={{
          minWidth:
            primaryMinWidth || undefined,
        }}
      >
        {primary}
      </div>

      <div
        className="cos-split-panel__secondary"
        style={{
          minWidth:
            secondaryMinWidth || undefined,
        }}
      >
        {secondary}
      </div>
    </section>
  );
}
