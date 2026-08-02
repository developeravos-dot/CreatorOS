import type {
  ReactNode,
} from "react";

interface WorkspaceShellProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export default function WorkspaceShell({
  children,
  className = "",
  compact = false,
}: WorkspaceShellProps) {
  return (
    <main
      className={[
        "cos-workspace-shell",
        compact
          ? "cos-workspace-shell--compact"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </main>
  );
}
