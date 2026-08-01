import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CreatorDialogFieldType =
  | "text"
  | "textarea"
  | "select"
  | "datetime-local";

export interface CreatorDialogOption {
  label: string;
  value: string;
}

export interface CreatorDialogField {
  name: string;
  label: string;
  type?: CreatorDialogFieldType;
  placeholder?: string;
  required?: boolean;
  initialValue?: string;
  options?: CreatorDialogOption[];
  rows?: number;
}

export interface CreatorDialogSubmitResult {
  [key: string]: string;
}

interface CreatorDialogProps {
  open: boolean;
  title: string;
  description?: string;
  icon?: string;
  fields?: CreatorDialogField[];
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (values: CreatorDialogSubmitResult) => void | Promise<void>;
}

export function CreatorDialog({
  open,
  title,
  description,
  icon = "✦",
  fields = [],
  confirmLabel = "حفظ",
  cancelLabel = "إلغاء",
  danger = false,
  busy = false,
  error = "",
  onClose,
  onSubmit,
}: CreatorDialogProps) {
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [field.name, field.initialValue ?? ""]),
      ),
    [fields],
  );

  const [values, setValues] =
    useState<CreatorDialogSubmitResult>(initialValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
  }, [open, initialValues]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, busy, onClose]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        return;
      }
    }

    await onSubmit(values);
  }

  return (
    <div
      dir="rtl"
      role="presentation"
      style={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={styles.dialog}
      >
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.header}>
          <div
            style={{
              ...styles.icon,
              ...(danger ? styles.dangerIcon : {}),
            }}
          >
            {icon}
          </div>

          <div style={{ flex: 1 }}>
            <div style={styles.eyebrow}>CREATOROS ENTERPRISE</div>
            <h2 style={styles.title}>{title}</h2>

            {description && (
              <p style={styles.description}>{description}</p>
            )}
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            style={styles.closeButton}
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.length > 0 && (
            <div style={styles.fields}>
              {fields.map((field) => (
                <label key={field.name} style={styles.field}>
                  <span style={styles.label}>
                    {field.label}
                    {field.required && (
                      <span style={styles.required}> *</span>
                    )}
                  </span>

                  {field.type === "textarea" ? (
                    <textarea
                      rows={field.rows ?? 5}
                      value={values[field.name] ?? ""}
                      placeholder={field.placeholder}
                      disabled={busy}
                      required={field.required}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      style={{
                        ...styles.input,
                        ...styles.textarea,
                      }}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={values[field.name] ?? ""}
                      disabled={busy}
                      required={field.required}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      style={styles.input}
                    >
                      <option value="">اختر...</option>

                      {field.options?.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={values[field.name] ?? ""}
                      placeholder={field.placeholder}
                      disabled={busy}
                      required={field.required}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                      style={styles.input}
                    />
                  )}
                </label>
              ))}
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.footer}>
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              style={styles.secondaryButton}
            >
              {cancelLabel}
            </button>

            <button
              type="submit"
              disabled={busy}
              style={{
                ...styles.primaryButton,
                ...(danger ? styles.dangerButton : {}),
                ...(busy ? styles.disabledButton : {}),
              }}
            >
              {busy ? (
                <>
                  <span style={styles.spinner} />
                  جارٍ التنفيذ...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "grid",
    placeItems: "center",
    padding: 24,
    background:
      "radial-gradient(circle at 20% 20%, rgba(54, 97, 255, 0.17), transparent 34%), rgba(2, 6, 18, 0.78)",
    backdropFilter: "blur(18px)",
  },

  dialog: {
    position: "relative",
    width: "min(620px, 100%)",
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    border: "1px solid rgba(139, 166, 255, 0.24)",
    borderRadius: 24,
    padding: 26,
    color: "#f4f7ff",
    background:
      "linear-gradient(145deg, rgba(18, 27, 48, 0.98), rgba(7, 12, 25, 0.98))",
    boxShadow:
      "0 36px 110px rgba(0, 0, 0, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    isolation: "isolate",
  },

  glowOne: {
    position: "absolute",
    width: 190,
    height: 190,
    top: -100,
    right: -70,
    borderRadius: "50%",
    background: "rgba(54, 104, 255, 0.22)",
    filter: "blur(42px)",
    pointerEvents: "none",
    zIndex: -1,
  },

  glowTwo: {
    position: "absolute",
    width: 150,
    height: 150,
    bottom: -90,
    left: -55,
    borderRadius: "50%",
    background: "rgba(212, 169, 76, 0.14)",
    filter: "blur(38px)",
    pointerEvents: "none",
    zIndex: -1,
  },

  header: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 24,
  },

  icon: {
    width: 52,
    height: 52,
    flex: "0 0 52px",
    display: "grid",
    placeItems: "center",
    borderRadius: 16,
    fontSize: 24,
    color: "#dce6ff",
    border: "1px solid rgba(99, 136, 255, 0.28)",
    background:
      "linear-gradient(145deg, rgba(53, 91, 216, 0.34), rgba(27, 43, 92, 0.38))",
    boxShadow: "0 10px 34px rgba(36, 82, 210, 0.2)",
  },

  dangerIcon: {
    color: "#ffd7dc",
    borderColor: "rgba(255, 100, 118, 0.3)",
    background:
      "linear-gradient(145deg, rgba(177, 43, 65, 0.4), rgba(79, 19, 32, 0.42))",
  },

  eyebrow: {
    marginBottom: 7,
    color: "#7097ff",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.8,
  },

  title: {
    margin: 0,
    fontSize: 25,
    fontWeight: 800,
    letterSpacing: -0.4,
  },

  description: {
    margin: "9px 0 0",
    color: "#9daac2",
    lineHeight: 1.7,
    fontSize: 14,
  },

  closeButton: {
    width: 38,
    height: 38,
    flex: "0 0 38px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    color: "#adb9ce",
    background: "rgba(255,255,255,0.035)",
    cursor: "pointer",
    fontSize: 24,
    lineHeight: 1,
  },

  fields: {
    display: "grid",
    gap: 17,
  },

  field: {
    display: "grid",
    gap: 8,
  },

  label: {
    color: "#d5ddef",
    fontSize: 13,
    fontWeight: 700,
  },

  required: {
    color: "#ef9ca8",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(116, 140, 190, 0.28)",
    borderRadius: 14,
    outline: "none",
    padding: "13px 15px",
    color: "#f2f5fc",
    background: "rgba(4, 9, 20, 0.72)",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
    fontSize: 14,
    fontFamily: "inherit",
  },

  textarea: {
    resize: "vertical",
    minHeight: 120,
    lineHeight: 1.7,
  },

  error: {
    marginTop: 18,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255, 102, 120, 0.25)",
    color: "#ffc2ca",
    background: "rgba(105, 24, 39, 0.28)",
    fontSize: 13,
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 11,
    marginTop: 26,
    paddingTop: 20,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  secondaryButton: {
    minWidth: 100,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 13,
    padding: "12px 18px",
    color: "#c7d1e4",
    background: "rgba(255,255,255,0.035)",
    cursor: "pointer",
    fontWeight: 700,
  },

  primaryButton: {
    minWidth: 130,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    border: "1px solid rgba(112, 148, 255, 0.28)",
    borderRadius: 13,
    padding: "12px 20px",
    color: "#ffffff",
    background:
      "linear-gradient(135deg, #315fef 0%, #456ef5 52%, #2749bd 100%)",
    boxShadow: "0 12px 34px rgba(40, 84, 220, 0.32)",
    cursor: "pointer",
    fontWeight: 800,
  },

  dangerButton: {
    borderColor: "rgba(255, 105, 122, 0.3)",
    background:
      "linear-gradient(135deg, #a72f45 0%, #ce4057 52%, #7f2335 100%)",
    boxShadow: "0 12px 34px rgba(155, 35, 57, 0.3)",
  },

  disabledButton: {
    cursor: "not-allowed",
    opacity: 0.65,
  },

  spinner: {
    width: 15,
    height: 15,
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "creatorDialogSpin 0.8s linear infinite",
  },
};

export default CreatorDialog;