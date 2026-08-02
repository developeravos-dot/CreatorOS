import type {
  ReactNode,
} from "react";

interface WorkspaceContentProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export default function WorkspaceContent({
  children,
  className = "",
  padded = true,
}: WorkspaceContentProps) {
  return (
    <section
      className={[
        "cos-workspace-content",
        padded
          ? "cos-workspace-content--padded"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
