import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import "./enterprise-layout.css";

interface InjectedLayoutProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCollapse?: () => void;
  onMobileOpen?: () => void;
  onMobileClose?: () => void;
}

interface MainLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function MainLayout({
  sidebar,
  header,
  children,
}: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const enhancedSidebar = isValidElement(sidebar)
    ? cloneElement(sidebar as ReactElement<InjectedLayoutProps>, {
        collapsed,
        mobileOpen,
        onCollapse: () => setCollapsed((current) => !current),
        onMobileClose: () => setMobileOpen(false),
      })
    : sidebar;

  const enhancedHeader = isValidElement(header)
    ? cloneElement(header as ReactElement<InjectedLayoutProps>, {
        onMobileOpen: () => setMobileOpen(true),
      })
    : header;

  return (
    <div
      className={[
        "creator-layout",
        collapsed ? "creator-layout--collapsed" : "",
        mobileOpen ? "creator-layout--mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {mobileOpen ? (
        <button
          type="button"
          className="creator-layout__mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside className="creator-layout__sidebar">
        {enhancedSidebar}
      </aside>

      <div className="creator-layout__body">
        <div className="creator-layout__header">
          {enhancedHeader}
        </div>

        <main className="creator-layout__workspace">
          <div className="creator-layout__workspace-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
