import {
  StatusBadge,
} from "../../../design-system";

interface DashboardConnectionBadgeProps {
  connected: boolean;
}

export default function DashboardConnectionBadge({
  connected,
}: DashboardConnectionBadgeProps) {
  return (
    <StatusBadge
      tone={
        connected
          ? "success"
          : "danger"
      }
    >
      {connected
        ? "Enterprise connected"
        : "Enterprise disconnected"}
    </StatusBadge>
  );
}
