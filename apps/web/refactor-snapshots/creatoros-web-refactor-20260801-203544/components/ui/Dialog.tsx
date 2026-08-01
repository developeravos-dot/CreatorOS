import { ReactNode, useEffect } from "react";

export interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  width?: number;
  onClose: () => void;
}

export function Dialog({
  open,
  title,
  children,
  width = 720,
  onClose,
}: DialogProps) {

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(12px)",
        zIndex: 99999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "95vw",
          maxHeight: "92vh",
          overflow: "auto",
          borderRadius: 24,
          background: "#0f172a",
          border: "1px solid #26324a",
          boxShadow: "0 40px 120px rgba(0,0,0,.55)",
        }}
      >
        <div
          style={{
            padding: 24,
            borderBottom: "1px solid #26324a",
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {title}
        </div>

        <div
          style={{
            padding: 28,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
