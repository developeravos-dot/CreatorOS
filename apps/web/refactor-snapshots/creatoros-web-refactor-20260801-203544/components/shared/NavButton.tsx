import { styles } from "../../styles/appStyles";

interface NavButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

export default function NavButton(props: NavButtonProps) {
  return (
    <button
      style={{
        ...styles.navButton,
        ...(props.active ? styles.navButtonActive : {}),
      }}
      onClick={props.onClick}
    >
      <span style={styles.navIcon}>{props.icon}</span>
      <span>{props.label}</span>
    </button>
  );
}
