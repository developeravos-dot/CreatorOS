import { styles } from "../../styles/appStyles";

interface ActionButtonProps {
  icon: string;
  title: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
}

export default function ActionButton(
  props: ActionButtonProps,
) {
  return (
    <button
      style={styles.actionButton}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <span style={styles.actionIcon}>
        {props.icon}
      </span>

      <span style={{ flex: 1 }}>
        <strong style={styles.actionTitle}>
          {props.title}
        </strong>

        <span style={styles.actionDescription}>
          {props.description}
        </span>
      </span>

      <span>←</span>
    </button>
  );
}
