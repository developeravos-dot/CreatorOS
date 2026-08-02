import { useState } from "react";
import { useTranslation } from "../hooks";
import AIContentStudioPage from "./AIContentStudioPage";
import AIStudioPage from "./AIStudioPage";

type AIStudioEnterpriseView =
  | "operations"
  | "workflow";

export default function AIStudioEnterprisePage() {
  const { t } = useTranslation();

  const [view, setView] =
    useState<AIStudioEnterpriseView>("operations");

  return (
    <div className="ai-studio-enterprise">
      <header className="ai-studio-enterprise__navigation">
        <div className="ai-studio-enterprise__brand">
          <span className="ai-studio-enterprise__brand-icon">
            ✦
          </span>

          <div>
            <span>{t("aiStudio.enterpriseLabel")}</span>
            <h1>{t("aiStudio.enterpriseTitle")}</h1>
            <p>{t("aiStudio.enterpriseSubtitle")}</p>
          </div>
        </div>

        <nav
          className="ai-studio-enterprise__tabs"
          aria-label={t("aiStudio.enterpriseNavigation")}
        >
          <button
            type="button"
            className={
              view === "operations"
                ? "ai-studio-enterprise__tab ai-studio-enterprise__tab--active"
                : "ai-studio-enterprise__tab"
            }
            onClick={() => setView("operations")}
          >
            <span>◎</span>

            <div>
              <strong>
                {t("aiStudio.operationsCenter")}
              </strong>

              <small>
                {t("aiStudio.operationsCenterDescription")}
              </small>
            </div>
          </button>

          <button
            type="button"
            className={
              view === "workflow"
                ? "ai-studio-enterprise__tab ai-studio-enterprise__tab--active"
                : "ai-studio-enterprise__tab"
            }
            onClick={() => setView("workflow")}
          >
            <span>⌘</span>

            <div>
              <strong>
                {t("aiStudio.workflowDesigner")}
              </strong>

              <small>
                {t("aiStudio.workflowDesignerDescription")}
              </small>
            </div>
          </button>
        </nav>

        <div className="ai-studio-enterprise__runtime">
          <span className="ai-studio-enterprise__runtime-dot" />

          <div>
            <strong>{t("aiStudio.runtimeOnline")}</strong>
            <small>{t("aiStudio.enterpriseConnected")}</small>
          </div>
        </div>
      </header>

      <section
        className="ai-studio-enterprise__workspace"
        data-view={view}
      >
        {view === "operations" ? (
          <AIStudioPage />
        ) : (
          <AIContentStudioPage />
        )}
      </section>
    </div>
  );
}
