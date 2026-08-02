import {
  useMemo,
  useState,
} from "react";
import { useTranslation } from "../../../hooks";
import type {
  AIRuntimeCollection,
  AIRuntimeProvider,
} from "./ai-runtime-types";

interface AIRuntimeProviderPanelProps {
  title: string;
  description: string;
  icon: string;
  collection: AIRuntimeCollection;
  pendingProviderId: string | null;
  onInspect: (providerId: string) => void;
  onPing: (providerId: string) => void;
  onDryRun: (providerId: string) => void;
}

export default function AIRuntimeProviderPanel({
  title,
  description,
  icon,
  collection,
  pendingProviderId,
  onInspect,
  onPing,
  onDryRun,
}: AIRuntimeProviderPanelProps) {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredProviders = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return collection.items;
    }

    return collection.items.filter(
      (provider) =>
        provider.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        provider.module
          .toLowerCase()
          .includes(normalizedSearch),
    );
  }, [collection.items, search]);

  const visibleProviders = expanded
    ? filteredProviders
    : filteredProviders.slice(0, 8);

  return (
    <article className="ai-runtime-panel">
      <header className="ai-runtime-panel__header">
        <div className="ai-runtime-panel__identity">
          <span className="ai-runtime-panel__icon">
            {icon}
          </span>

          <div>
            <span>{description}</span>
            <h3>{title}</h3>
          </div>
        </div>

        <strong className="ai-runtime-panel__count">
          {collection.total}
        </strong>
      </header>

      <label className="ai-runtime-panel__search">
        <span>⌕</span>

        <input
          type="search"
          value={search}
          placeholder={`${t(
            "aiStudio.searchRuntime",
          )} ${title}`}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </label>

      <div className="ai-runtime-provider-list">
        {visibleProviders.length === 0 ? (
          <div className="ai-runtime-provider-list__empty">
            {t("aiStudio.noRuntimeProviders")}
          </div>
        ) : (
          visibleProviders.map(
            (provider: AIRuntimeProvider) => {
              const busy =
                pendingProviderId === provider.id;

              return (
                <div
                  className="ai-runtime-provider"
                  key={provider.id}
                >
                  <span
                    className={[
                      "ai-runtime-provider__status",
                      provider.available
                        ? "ai-runtime-provider__status--online"
                        : "ai-runtime-provider__status--offline",
                    ].join(" ")}
                  />

                  <div className="ai-runtime-provider__main">
                    <strong>{provider.name}</strong>
                    <small>{provider.module}</small>
                  </div>

                  <span className="ai-runtime-provider__scope">
                    {provider.scope === "0"
                      ? "singleton"
                      : provider.scope}
                  </span>

                  <div className="ai-runtime-provider__actions">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onInspect(provider.id)
                      }
                    >
                      {t("aiStudio.inspect")}
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onPing(provider.id)
                      }
                    >
                      {t("aiStudio.ping")}
                    </button>

                    <button
                      type="button"
                      className="primary"
                      disabled={busy}
                      onClick={() =>
                        onDryRun(provider.id)
                      }
                    >
                      {busy
                        ? "…"
                        : t("aiStudio.dryRun")}
                    </button>
                  </div>
                </div>
              );
            },
          )
        )}
      </div>

      {filteredProviders.length > 8 ? (
        <button
          type="button"
          className="ai-runtime-panel__expand"
          onClick={() =>
            setExpanded((current) => !current)
          }
        >
          {expanded
            ? t("aiStudio.showLess")
            : `${t("aiStudio.showAll")} ${
                filteredProviders.length
              }`}
        </button>
      ) : null}
    </article>
  );
}
