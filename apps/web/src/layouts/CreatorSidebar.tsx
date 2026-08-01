import type { CreatorView } from "./creatorView";

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
    label: "COMMAND CENTER",
    items: [
      {
        view: "dashboard",
        label: "Dashboard",
        icon: "⌂",
      },
      {
        view: "projects",
        label: "Projects",
        icon: "▦",
      },
      {
        view: "scripts",
        label: "Scripts",
        icon: "✎",
      },
      {
        view: "calendar",
        label: "Content Calendar",
        icon: "▣",
      },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      {
        view: "ai-content",
        label: "AI Content Studio",
        icon: "✦",
      },
      {
        view: "prompts",
        label: "Prompt Library",
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
              ? "Expand navigation"
              : "Collapse navigation"
          }
          onClick={onCollapse}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </header>

      <nav
        className="creator-sidebar__navigation"
        aria-label="CreatorOS navigation"
      >
        {navigationGroups.map((group) => (
          <section
            className="creator-sidebar__section"
            key={group.label}
          >
            <p className="creator-sidebar__section-title">
              {group.label}
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
                      {item.label}
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
                ? "System operational"
                : "System disconnected"}
            </strong>

            <span>
              {connected
                ? "Frontend and backend connected"
                : "Backend connection unavailable"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
