interface CreatorHeaderProps {
  title: string;
  loading: boolean;
  busy: boolean;
  onRefresh: () => void;
  onMobileOpen?: () => void;
}

export default function CreatorHeader({
  title,
  loading,
  busy,
  onRefresh,
  onMobileOpen,
}: CreatorHeaderProps) {
  return (
    <header className="creator-header">
      <div className="creator-header__left">
        <button
          type="button"
          className="creator-header__mobile-menu"
          aria-label="Open navigation"
          onClick={onMobileOpen}
        >
          ☰
        </button>

        <div className="creator-header__title">
          <span>CreatorOS Enterprise</span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="creator-header__right">
        <label className="creator-header__search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search CreatorOS..."
          />

          <kbd>Ctrl K</kbd>
        </label>

        <span className="creator-header__connection">
          <span className="creator-header__connection-dot" />
          Production
        </span>

        <button
          type="button"
          className="creator-header__refresh"
          disabled={loading || busy}
          aria-label="Refresh dashboard"
          title="Refresh dashboard"
          onClick={onRefresh}
        >
          {loading || busy ? "…" : "↻"}
        </button>

        <div className="creator-header__profile">
          <span className="creator-header__avatar">K</span>

          <div className="creator-header__profile-text">
            <strong>Workspace Admin</strong>
            <span>CreatorOS Enterprise</span>
          </div>
        </div>
      </div>
    </header>
  );
}
