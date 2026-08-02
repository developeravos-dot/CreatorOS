import type {
  ReactNode,
} from "react";

interface ButtonGroupProps {
  children: ReactNode;
  align?:
    | "start"
    | "center"
    | "end"
    | "between";

  className?: string;
}

export default function ButtonGroup({
  children,
  align = "end",
  className = "",
}: ButtonGroupProps) {
  return (
    <div
      className={[
        "cos-button-group",
        `cos-button-group--${align}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
