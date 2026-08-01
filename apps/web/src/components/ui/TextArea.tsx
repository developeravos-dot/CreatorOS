import { TextareaHTMLAttributes } from "react";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({
  label,
  style,
  ...props
}: TextAreaProps) {

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

      <textarea
        {...props}
        style={{
          width: "100%",
          minHeight: 160,
          boxSizing: "border-box",
          resize: "vertical",
          background: "#111827",
          color: "#fff",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: "16px",
          fontSize: 15,
          outline: "none",
          transition: ".2s",
          ...style,
        }}
      />
    </div>
  );
}

export default TextArea;
