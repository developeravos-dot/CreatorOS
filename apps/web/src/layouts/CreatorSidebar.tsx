import type { CreatorView } from "./creatorView";
import { useTranslation } from "../hooks";

interface CreatorSidebarProps {
  view: CreatorView;
  connected: boolean;
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCollapse?: () => void;
  onMobileClose?: () => void;
  onViewChange: (view: CreatorView) => void;
}

const navigationGroups: Array<{
  label: string;
  items: Array<{
    view: CreatorView;
    label: string;
    icon: string;
  }>;
}> = [
  {
    label:  "navigation.commandCenter" ,
    items: [
      {
        view: "dashboard",
        label:  "navigation.dashboard" ,
        icon: "⌂",
      },
      {
        view: "projects",
        label:  "navigation.projects" ,
        icon: "▦",
      },
      {
        view: "scripts",
        label:  "navigation.scripts" ,
        icon: "✎",
      },
      {
        view: "calendar",
        label:  "navigation.calendar" ,
        icon: "▣",
      },
    ],
  },
  {
    label:  "navigation.intelligence" ,
    items: [
      {
        view: "ai-content",
        label:  "navigation.aiStudio" ,
        icon: "✦",
      },
      {
        view: "prompts",
        label:  "navigation.prompts" ,
        icon: "◇",
      },
    ],
  },
];

export default function CreatorSidebar({
  view,
  connected,
  collapsed,
  onCollapse,
  onMobileClose,
  onViewChange,
}: CreatorSidebarProps) {

  const { t } = useTranslation();
  function selectView(nextView: CreatorView) {
    onViewChange(nextView);
    onMobileClose?.();
  }

  return (
    <div className="creator-sidebar">
      <header className="creator-sidebar__brand">
        <span className="creator-sidebar__logo">C</span>

        <div className="creator-sidebar__brand-text">
          <strong>CreatorOS</strong>
          <span>Enterprise</span>
        </div>

        <button
          type="button"
          className="creator-sidebar__collapse"
          aria-label={
            collapsed
              ? t("navigation.expand")
              : t("navigation.collapse")
          }
          onClick={onCollapse}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </header>

      <nav
        className="creator-sidebar__navigation"
        aria-label={t("navigation.aria")}
      >
        {navigationGroups.map((group) => (
          <section
            className="creator-sidebar__section"
            key={t(group.label)}
          >
            <p className="creator-sidebar__section-title">
              {t(group.label)}
            </p>

            <div className="creator-sidebar__items">
              {group.items.map((item) => {
                const active = view === item.view;

                return (
                  <button
                    type="button"
                    key={item.view}
                    className={[
                      "creator-sidebar__item",
                      active
                        ? "creator-sidebar__item--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => selectView(item.view)}
                  >
                    <span className="creator-sidebar__icon">
                      {item.icon}
                    </span>

                    <span className="creator-sidebar__label">
                      {t(item.label)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <footer className="creator-sidebar__footer">
        <div
          className={[
            "creator-sidebar__status",
            connected
              ? ""
              : "creator-sidebar__status--offline",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="creator-sidebar__status-dot" />

          <div className="creator-sidebar__status-text">
            <strong>
              {connected
                ? t("system.operational")
                : t("system.disconnected")}
            </strong>

            <span>
              {connected
                ? t("system.connected")
                : t("system.backendUnavailable")}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}




