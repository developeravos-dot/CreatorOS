import { SelectHTMLAttributes } from "react";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({
  label,
  children,
  style,
  ...props
}: SelectProps) {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {label && (
        <label
          style={{
            color: "#cbd5e1",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {label}
        </label>
      )}

      <select
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#111827",
          color: "#ffffff",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: "14px 16px",
          fontSize: 15,
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          transition: ".2s",
          ...style,
        }}
      >
        {children}
      </select>
    </div>
  );
}

export default Select;
