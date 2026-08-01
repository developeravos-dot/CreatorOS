import { ButtonHTMLAttributes } from "react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {

  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  variant = "primary",
  style,
  children,
  ...props
}: ButtonProps) {

  const colors = {
    primary: {
      background: "#2563eb",
      color: "#ffffff",
      border: "#2563eb",
    },
    secondary: {
      background: "#111827",
      color: "#ffffff",
      border: "#334155",
    },
    danger: {
      background: "#dc2626",
      color: "#ffffff",
      border: "#dc2626",
    },
  }[variant];

  return (
    <button
      {...props}
      style={{
        padding: "14px 22px",
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.color,
        cursor: "pointer",
        fontSize: 15,
        fontWeight: 600,
        transition: ".2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default Button;
