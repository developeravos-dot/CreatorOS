import { NavButton } from "../components/shared";
import { styles } from "../styles/appStyles";
import type { CreatorView } from "./creatorView";

interface CreatorSidebarProps {
  view: CreatorView;
  connected: boolean;
  onViewChange: (view: CreatorView) => void;
}

export default function CreatorSidebar(
  props: CreatorSidebarProps,
) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logo}>C</div>

        <div>
          <strong style={styles.brandName}>
            CreatorOS
          </strong>

          <div style={styles.brandSubtitle}>
            AI MEDIA OPERATING SYSTEM
          </div>
        </div>
      </div>

      <nav style={styles.nav}>
        <NavButton
          active={props.view === "dashboard"}
          icon="⌂"
          label="لوحة التحكم"
          onClick={() =>
            props.onViewChange("dashboard")
          }
        />

        <NavButton
          active={props.view === "projects"}
          icon="▦"
          label="المشاريع"
          onClick={() =>
            props.onViewChange("projects")
          }
        />

        <NavButton
          active={props.view === "scripts"}
          icon="✎"
          label="محرر السكربت"
          onClick={() =>
            props.onViewChange("scripts")
          }
        />

        <NavButton
          active={props.view === "calendar"}
          icon="▣"
          label="تقويم المحتوى"
          onClick={() =>
            props.onViewChange("calendar")
          }
        />

        <NavButton
          active={props.view === "prompts"}
          icon="✦"
          label="القوالب الذكية"
          onClick={() =>
            props.onViewChange("prompts")
          }
        />
        <NavButton
          active={props.view === "ai-content"}
          icon="✦"
          label="استوديو المحتوى الذكي"
          onClick={() =>
            props.onViewChange("ai-content")
          }
        />
      </nav>

      <div style={styles.connectionBox}>
        <div
          style={{
            ...styles.connectionDot,
            background: props.connected
              ? "#42e8a1"
              : "#ff5f74",
          }}
        />

        <div>
          <strong>
            {props.connected
              ? "Backend API متصل"
              : "Backend API غير متصل"}
          </strong>

          <div style={styles.mutedSmall}>
            البيانات محفوظة في الخادم
          </div>
        </div>
      </div>
    </aside>
  );
}
