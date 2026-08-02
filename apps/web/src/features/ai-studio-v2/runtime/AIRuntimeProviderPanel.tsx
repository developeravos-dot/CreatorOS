import {
  useMemo,
  useState,
} from "react";
import { useTranslation } from "../../../hooks";
import {
  getRuntimeProviderMetadata,
  type AIRuntimeMetadataCategory,
} from "./ai-runtime-metadata";
import type {
  AIRuntimeCollection,
  AIRuntimeProvider,
} from "./ai-runtime-types";

interface AIRuntimeProviderPanelProps {
  title: string;
  description: string;
  icon: string;
  collection: AIRuntimeCollection;
  selectedProviderId: string | null;
  pendingProviderId: string | null;
  onSelect: (provider: AIRuntimeProvider) => void;
  onInspect: (providerId: string) => void;
  onPing: (providerId: string) => void;
  onDryRun: (providerId: string) => void;
}

interface ProviderViewModel {
  provider: AIRuntimeProvider;
  metadata: ReturnType<
    typeof getRuntimeProviderMetadata
  >;
}

export default function AIRuntimeProviderPanel({
  title,
  description,
  icon,
  collection,
  selectedProviderId,
  pendingProviderId,
  onSelect,
  onInspect,
  onPing,
  onDryRun,
}: AIRuntimeProviderPanelProps) {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("all");
  const [availability, setAvailability] =
    useState("all");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const providerViewModels =
    useMemo<ProviderViewModel[]>(
      () =>
        collection.items.map((provider) => ({
          provider,
          metadata:
            getRuntimeProviderMetadata(provider),
        })),
      [collection.items],
    );

  const scopes = useMemo(
    () =>
      Array.from(
        new Set(
          collection.items
            .map((provider) => provider.scope)
            .filter(Boolean),
        ),
      ),
    [collection.items],
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          providerViewModels.map(
            (item) => item.metadata.category,
          ),
        ),
      ),
    [providerViewModels],
  );

  const filteredProviders = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return providerViewModels.filter(
      ({ provider, metadata }) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          metadata.displayName
            .toLowerCase()
            .includes(normalizedSearch) ||
          metadata.moduleDisplayName
            .toLowerCase()
            .includes(normalizedSearch) ||
          provider.name
            .toLowerCase()
            .includes(normalizedSearch) ||
          provider.module
            .toLowerCase()
            .includes(normalizedSearch) ||
          provider.capability
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesScope =
          scope === "all" ||
          provider.scope === scope;

        const matchesAvailability =
          availability === "all" ||
          (availability === "available" &&
            provider.available) ||
          (availability === "unavailable" &&
            !provider.available);

        const matchesCategory =
          category === "all" ||
          metadata.category === category;

        return (
          matchesSearch &&
          matchesScope &&
          matchesAvailability &&
          matchesCategory
        );
      },
    );
  }, [
    availability,
    category,
    providerViewModels,
    scope,
    search,
  ]);

  const visibleProviders = expanded
    ? filteredProviders
    : filteredProviders.slice(0, 12);

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
          {filteredProviders.length}
        </strong>
      </header>

      <div className="ai-runtime-provider-filters ai-runtime-provider-filters--catalog">
        <label className="ai-runtime-panel__search">
          <span>⌕</span>

          <input
            type="search"
            value={search}
            placeholder={t(
              "aiStudio.searchProviders",
            )}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </label>

        <select
          value={category}
          aria-label={t("aiStudio.filterCategory")}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option value="all">
            {t("aiStudio.allCategories")}
          </option>

          {categories.map((item) => (
            <option value={item} key={item}>
              {t(
                `aiStudio.metadata.categories.${item}`,
              )}
            </option>
          ))}
        </select>

        <select
          value={scope}
          aria-label={t("aiStudio.filterScope")}
          onChange={(event) =>
            setScope(event.target.value)
          }
        >
          <option value="all">
            {t("aiStudio.allScopes")}
          </option>

          {scopes.map((item) => (
            <option value={item} key={item}>
              {item === "0"
                ? t("aiStudio.singleton")
                : item === "default"
                  ? t("aiStudio.defaultScope")
                  : item}
            </option>
          ))}
        </select>

        <select
          value={availability}
          aria-label={t(
            "aiStudio.filterAvailability",
          )}
          onChange={(event) =>
            setAvailability(event.target.value)
          }
        >
          <option value="all">
            {t("aiStudio.allAvailability")}
          </option>
          <option value="available">
            {t("aiStudio.available")}
          </option>
          <option value="unavailable">
            {t("aiStudio.unavailable")}
          </option>
        </select>
      </div>

      <div className="ai-runtime-provider-list">
        {visibleProviders.length === 0 ? (
          <div className="ai-runtime-provider-list__empty">
            {t("aiStudio.noRuntimeProviders")}
          </div>
        ) : (
          visibleProviders.map(
            ({ provider, metadata }) => {
              const localizedDisplayName =
                metadata.displayNameKey
                  ? t(metadata.displayNameKey)
                  : metadata.displayName;

              const busy =
                pendingProviderId === provider.id;

              const selected =
                selectedProviderId === provider.id;

              return (
                <section
                  className={[
                    "ai-runtime-provider",
                    "ai-runtime-provider--catalog",
                    selected
                      ? "ai-runtime-provider--selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={provider.id}
                >
                  <button
                    type="button"
                    className="ai-runtime-provider__select"
                    onClick={() => onSelect(provider)}
                  >
                    <span className="ai-runtime-provider__catalog-icon">
                      {metadata.icon}
                    </span>

                    <span className="ai-runtime-provider__main">
                      <strong
                        title={localizedDisplayName}
                      >
                        {localizedDisplayName}
                      </strong>

                      <small
                        title={metadata.moduleDisplayName}
                      >
                        {metadata.moduleDisplayName}
                      </small>
                    </span>

                    <span className="ai-runtime-provider__scope">
                      {provider.scope === "0"
                        ? t("aiStudio.singleton")
                        : provider.scope === "default"
                          ? t(
                              "aiStudio.enterpriseRuntime",
                            )
                          : provider.scope}
                    </span>

                    <span className="ai-runtime-provider__open">
                      ›
                    </span>
                  </button>

                  <div className="ai-runtime-provider__description">
                    {t(metadata.descriptionKey)}
                  </div>

                  <div className="ai-runtime-provider__meta">
                    <span>
                      {t(metadata.categoryKey)}
                    </span>

                    <span>
                      {t(
                        `aiStudio.capabilities.${provider.capability}`,
                      )}
                    </span>

                    <span
                      className={
                        provider.available
                          ? "available"
                          : "unavailable"
                      }
                    >
                      {provider.available
                        ? t("aiStudio.available")
                        : t("aiStudio.unavailable")}
                    </span>
                  </div>

                  <div className="ai-runtime-provider__technical">
                    <span
                      title={metadata.technicalName}
                    >
                      {metadata.technicalName}
                    </span>
                  </div>

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
                </section>
              );
            },
          )
        )}
      </div>

      {filteredProviders.length > 12 ? (
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

