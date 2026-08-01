import { InputHTMLAttributes } from "react";

export interface TextFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextField({
  label,
  style,
  ...props
}: TextFieldProps) {

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

      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#111827",
          color: "#fff",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: "14px 16px",
          fontSize: 15,
          outline: "none",
          transition: "0.2s",
          ...style,
        }}
      />
    </div>
  );
}

export default TextField;
