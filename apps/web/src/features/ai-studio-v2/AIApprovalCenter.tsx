import { useTranslation } from "../../hooks";
import type { AIStudioApproval } from "./ai-studio-types";

interface AIApprovalCenterProps {
  approvals: AIStudioApproval[];
  onApprove: (approval: AIStudioApproval) => void;
  onReject: (approval: AIStudioApproval) => void;
}

export default function AIApprovalCenter({
  approvals,
  onApprove,
  onReject,
}: AIApprovalCenterProps) {
  const { t } = useTranslation();

  return (
    <section className="ai-studio-panel ai-studio-approvals">
      <header className="ai-studio-panel__header">
        <div>
          <span>{t("aiStudio.humanAuthority")}</span>
          <h3>{t("aiStudio.approvalCenter")}</h3>
        </div>

        <strong>{approvals.length}</strong>
      </header>

      {approvals.length === 0 ? (
        <div className="ai-studio-empty">
          <strong>{t("aiStudio.noApprovals")}</strong>
          <span>{t("aiStudio.noApprovalsDescription")}</span>
        </div>
      ) : (
        <div className="ai-studio-approval-list">
          {approvals.map((approval) => (
            <article
              className="ai-studio-approval"
              key={approval.id}
            >
              <header>
                <div>
                  <strong>{approval.title}</strong>
                  <small>
                    {approval.agent} · {approval.createdAt}
                  </small>
                </div>

                <span
                  className={[
                    "ai-studio-risk",
                    `ai-studio-risk--${approval.risk}`,
                  ].join(" ")}
                >
                  {t(`aiStudio.risk.${approval.risk}`)}
                </span>
              </header>

              <p>{approval.description}</p>

              <footer>
                <button
                  type="button"
                  className="ai-studio-button"
                  onClick={() => onReject(approval)}
                >
                  {t("aiStudio.reject")}
                </button>

                <button
                  type="button"
                  className="ai-studio-button ai-studio-button--primary"
                  onClick={() => onApprove(approval)}
                >
                  {t("aiStudio.approve")}
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
