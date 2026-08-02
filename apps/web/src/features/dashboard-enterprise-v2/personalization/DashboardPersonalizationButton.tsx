interface DashboardPersonalizationButtonProps {
  onClick: () => void;
}

export default function DashboardPersonalizationButton({
  onClick,
}: DashboardPersonalizationButtonProps) {
  return (
    <button
      type="button"
      className="dashboard-personalization-button"
      onClick={onClick}
    >
      Personalize dashboard
    </button>
  );
}
