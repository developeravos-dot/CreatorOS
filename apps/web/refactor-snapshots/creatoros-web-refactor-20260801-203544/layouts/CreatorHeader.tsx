import { styles } from "../styles/appStyles";

interface CreatorHeaderProps {
  title: string;
  subtitle?: string;
  loading: boolean;
  busy: boolean;
  onRefresh: () => void | Promise<void>;
}

export default function CreatorHeader(
  props: CreatorHeaderProps,
) {
  return (
    <header style={styles.header}>
      <div>
        <div style={styles.eyebrow}>
          CREATOROS ENTERPRISE
        </div>

        <h1 style={styles.title}>
          {props.title}
        </h1>

        <p style={styles.subtitle}>
          {props.subtitle ??
            "منظومة تشغيل وإدارة وإنتاج المحتوى بالذكاء الاصطناعي."}
        </p>
      </div>

      <button
        type="button"
        style={styles.refreshButton}
        disabled={props.loading || props.busy}
        onClick={() => void props.onRefresh()}
      >
        ↻ تحديث البيانات
      </button>
    </header>
  );
}
