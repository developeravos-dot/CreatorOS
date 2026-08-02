import type {
  ReactNode,
} from "react";

export type StatusBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusBadgeTone;
  dot?: boolean;
  className?: string;
}

export default function StatusBadge({
  children,
  tone = "neutral",
  dot = true,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "cos-status-badge",
        `cos-status-badge--${tone}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="cos-status-badge__dot"
        />
      ) : null}

      <span>{children}</span>
    </span>
  );
}
