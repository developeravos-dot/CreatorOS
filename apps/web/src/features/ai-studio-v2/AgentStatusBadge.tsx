import { useTranslation } from "../../hooks";
import type { AgentStatus } from "./ai-studio-types";

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

export default function AgentStatusBadge({
  status,
}: AgentStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={[
        "ai-studio-status",
        `ai-studio-status--${status}`,
      ].join(" ")}
    >
      <span />
      {t(`aiStudio.status.${status}`)}
    </span>
  );
}
