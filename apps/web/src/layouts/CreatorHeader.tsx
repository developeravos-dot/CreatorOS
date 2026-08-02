import { useTranslation } from "../hooks";

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

  const { t } = useTranslation();
  return (
    <header className="creator-header">
      <div className="creator-header__left">
        <button
          type="button"
          className="creator-header__mobile-menu"
          aria-label={t("navigation.open")}
          onClick={onMobileOpen}
        >
          ☰
        </button>

        <div className="creator-header__title">
          <span>{t("app.name")}</span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="creator-header__right">
        <label className="creator-header__search">
          <span>⌕</span>

          <input
            type="search"
            placeholder={t("header.search")}
          />

          <kbd>Ctrl K</kbd>
        </label>

        <span className="creator-header__connection">
          <span className="creator-header__connection-dot" />
          {t("header.production")}
        </span>

        <button
          type="button"
          className="creator-header__refresh"
          disabled={loading || busy}
          aria-label={t("header.refresh")}
          title={t("header.refresh")}
          onClick={onRefresh}
        >
          {loading || busy ? "…" : "↻"}
        </button>

        <div className="creator-header__profile">
          <span className="creator-header__avatar">K</span>

          <div className="creator-header__profile-text">
            <strong>{t("header.admin")}</strong>
            <span>{t("app.name")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}


